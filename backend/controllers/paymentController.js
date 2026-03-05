import crypto from 'crypto'
import Course from '../models/Course.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import { createProviderOrder } from '../utils/paymentProvider.js'

export async function createOrder(req, res) {
  try {
    const { courseId } = req.body || {}

    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' })
    }

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    const price = Number(course.price)
    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ error: 'Invalid course price' })
    }

    const amount = price
    const currency = 'INR'

    const order = await Order.create({
      userId: req.user,
      courseId: course._id,
      amount,
      currency,
      status: 'created',
    })

    const providerData = await createProviderOrder({
      amount,
      currency,
      receipt: String(order._id),
    })

    if (providerData?.provider) {
      order.provider = providerData.provider
    }
    if (providerData?.providerOrderId) {
      order.providerOrderId = providerData.providerOrderId
    }
    await order.save()

    return res.status(201).json({
      ok: true,
      orderId: order._id,
      amount: order.amount,
      currency: order.currency,
      provider: order.provider,
      providerOrderId: providerData?.providerOrderId || null,
      courseTitle: course.title,
    })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create order' })
  }
}

export async function verifyPayment(req, res) {
  try {
    const {
      orderId,
      providerOrderId: bodyProviderOrderId,
      providerPaymentId,
      signature,
      success,
    } = req.body || {}

    if (!orderId && !bodyProviderOrderId) {
      return res
        .status(400)
        .json({ error: 'orderId or providerOrderId is required' })
    }

    const orderQuery = orderId
      ? { _id: orderId, userId: req.user }
      : { providerOrderId: bodyProviderOrderId, userId: req.user }

    const order = await Order.findOne(orderQuery)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    if (order.status === 'paid') {
      return res.status(200).json({ ok: true })
    }

    const providerOrderId = bodyProviderOrderId || order.providerOrderId
    const provider = order.provider || 'dev'

    let isValid = false

    if (provider === 'razorpay') {
      if (!providerOrderId || !providerPaymentId || !signature) {
        return res
          .status(400)
          .json({ error: 'Missing payment verification fields' })
      }

      const secret = process.env.RAZORPAY_KEY_SECRET
      if (!secret) {
        return res
          .status(500)
          .json({ error: 'Payment verification not configured' })
      }

      const body = `${providerOrderId}|${providerPaymentId}`
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex')

      isValid = expectedSignature === signature
    } else {
      const devSuccess =
        success === true ||
        success === 'true' ||
        success === 1 ||
        success === '1'
      isValid = Boolean(devSuccess)
    }

    if (!isValid) {
      return res.status(400).json({ error: 'Payment verification failed' })
    }

    if (providerPaymentId) {
      order.providerPaymentId = providerPaymentId
      await order.save()
    }

    await User.updateOne(
      { _id: order.userId },
      { $push: { enrolledCourses: order.courseId } }
    )

    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to verify payment' })
  }
}



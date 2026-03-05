import Course from '../models/Course.js'
import Order from '../models/Order.js'
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
    })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create order' })
  }
}


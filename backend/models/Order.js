import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },
    provider: {
      type: String,
      enum: ['razorpay', 'dev'],
      default: 'dev',
    },
    providerOrderId: {
      type: String,
    },
    providerPaymentId: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('Order', orderSchema)


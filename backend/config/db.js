import mongoose from 'mongoose'

export async function connectDb() {
  const uri = process.env.MONGO_URL
  if (!uri) {
    console.warn('MONGO_URL not set; skipping DB connect')
    return
  }
  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connect error:', err.message)
  }
}

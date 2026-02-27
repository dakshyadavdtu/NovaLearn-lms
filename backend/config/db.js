import mongoose from 'mongoose'

export async function connectDb() {
  const uri = process.env.DB_URI

  if (!uri) {
    console.warn('DB_URI missing, skipping DB connect for now')
    return
  }

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connect error:', err.message)
  }
}

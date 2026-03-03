import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

const storage = multer.memoryStorage()
export const uploadSingle = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('thumbnail')

export async function uploadToCloud(buffer, folder = 'lms-thumbnails') {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return null
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => (err ? reject(err) : resolve(result?.secure_url))
    )
    uploadStream.end(buffer)
  })
}

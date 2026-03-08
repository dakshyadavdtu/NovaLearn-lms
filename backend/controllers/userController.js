import User from '../models/User.js'
import Course from '../models/Course.js'
import { uploadImage } from '../utils/cloudinary.js'

function toSafeUser(user) {
  if (!user) return null
  const u = user.toObject ? user.toObject() : user
  delete u.password
  return u
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user)
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.json({ ok: true, user: toSafeUser(user) })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get user' })
  }
}

export function pingAuth(req, res) {
  return res.json({ ok: true, userId: req.user })
}

export async function updateProfile(req, res) {
  try {
    const user = await User.findById(req.user)
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (req.body.name != null && String(req.body.name).trim() !== '') {
      user.name = String(req.body.name).trim()
    }
    if (req.body.bio !== undefined) {
      user.bio = String(req.body.bio)
    }
    if (req.file?.buffer) {
      const result = await uploadImage(req.file.buffer, 'lms-avatars')
      if (result?.secure_url) user.avatar = result.secure_url
    }
    await user.save()
    return res.json({ ok: true, user: toSafeUser(user) })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile' })
  }
}

export async function getEnrolledCourses(req, res) {
  try {
    const user = await User.findById(req.user).populate('enrolledCourses')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const courses = Array.isArray(user.enrolledCourses)
      ? user.enrolledCourses.map((course) => {
          if (!course) return null
          const c = course.toObject ? course.toObject() : course
          return {
            _id: c._id,
            title: c.title,
            description: c.description || '',
            thumbnail: c.thumbnail || null,
            ratingAvg: c.ratingAvg,
            ratingCount: c.ratingCount,
          }
        }).filter(Boolean)
      : []
    return res.json({ ok: true, courses })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get enrolled courses' })
  }
}

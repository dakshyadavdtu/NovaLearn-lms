import Course from '../models/Course.js'
import { uploadImage } from '../utils/cloudinary.js'

export async function createCourse(req, res) {
  try {
    const { title, description } = req.body
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }
    let thumbnailUrl
    if (req.file && req.file.buffer) {
      const result = await uploadImage(req.file.buffer)
      thumbnailUrl = result?.secure_url
    }
    const course = await Course.create({
      title: title.trim(),
      description: description ? String(description).trim() : undefined,
      creator: req.user,
      ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
    })
    return res.status(201).json(course)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create course' })
  }
}

export async function getMyCourses(req, res) {
  try {
    const courses = await Course.find({ creator: req.user }).sort({ updatedAt: -1 })
    return res.json(courses)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get courses' })
  }
}

export async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id).populate('creator', 'name email')
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }
    return res.json(course)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get course' })
  }
}

export async function updateCourse(req, res) {
  try {
    const { title, description, isPublished } = req.body
    const course = await Course.findById(req.params.id)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }
    if (course.creator.toString() !== req.user) {
      return res.status(403).json({ error: 'Not your course' })
    }
    if (req.file && req.file.buffer) {
      const result = await uploadImage(req.file.buffer)
      if (result?.secure_url) course.thumbnail = result.secure_url
    }
    if (title !== undefined) {
      course.title = String(title).trim()
    }
    if (description !== undefined) {
      course.description = String(description).trim()
    }
    if (typeof isPublished === 'boolean') {
      course.isPublished = isPublished
    }
    await course.save()
    return res.json(course)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update course' })
  }
}

export async function deleteCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }
    if (course.creator.toString() !== req.user) {
      return res.status(403).json({ error: 'Not your course' })
    }
    await Course.findByIdAndDelete(req.params.id)
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete course' })
  }
}

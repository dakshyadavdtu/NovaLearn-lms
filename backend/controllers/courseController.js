import Course from '../models/Course.js'
import { uploadToCloud } from '../utils/upload.js'

const ALLOWED_UPDATE = ['title', 'description', 'thumbnail', 'published']

function pick(obj, keys) {
  const out = {}
  for (const k of keys) {
    if (obj[k] !== undefined) out[k] = obj[k]
  }
  return out
}

export async function createCourse(req, res) {
  try {
    const { title, description } = req.body
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }
    let thumbnail = ''
    if (req.file?.buffer) {
      const url = await uploadToCloud(req.file.buffer)
      if (url) thumbnail = url
    }
    const course = await Course.create({
      title: title.trim(),
      description: (description || '').trim(),
      thumbnail,
      educator: req.user,
    })
    return res.status(201).json({ course })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create course' })
  }
}

export async function listMyCourses(req, res) {
  try {
    const courses = await Course.find({ educator: req.user })
      .sort({ updatedAt: -1 })
      .lean()
    return res.json({ courses })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list courses' })
  }
}

export async function updateCourse(req, res) {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      educator: req.user,
    })
    if (!course) return res.status(404).json({ error: 'Course not found' })

    const updates = pick(req.body, ALLOWED_UPDATE)
    if (req.file?.buffer) {
      const url = await uploadToCloud(req.file.buffer)
      if (url) updates.thumbnail = url
    }
    updates.updatedAt = new Date()
    Object.assign(course, updates)
    await course.save()
    return res.json({ course })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update course' })
  }
}

export async function deleteCourse(req, res) {
  try {
    const result = await Course.findOneAndDelete({
      _id: req.params.id,
      educator: req.user,
    })
    if (!result) return res.status(404).json({ error: 'Course not found' })
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete course' })
  }
}

export async function getCourse(req, res) {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      educator: req.user,
    }).lean()
    if (!course) return res.status(404).json({ error: 'Course not found' })
    return res.json({ course })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get course' })
  }
}

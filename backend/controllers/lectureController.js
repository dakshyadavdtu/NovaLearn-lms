import Lecture from '../models/Lecture.js'
import Course from '../models/Course.js'

export async function createLecture(req, res) {
  try {
    const { courseId } = req.params
    const { title, description, isPreviewFree } = req.body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }
    if (course.creator.toString() !== req.user) {
      return res.status(403).json({ error: 'Not your course' })
    }

    const lecture = await Lecture.create({
      courseId: course._id,
      title: title.trim(),
      description: description ? String(description).trim() : undefined,
      isPreviewFree: isPreviewFree === true || isPreviewFree === 'true',
    })

    course.lectures.push(lecture._id)
    await course.save()

    return res.status(201).json(lecture)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create lecture' })
  }
}

export async function getCourseLectures(req, res) {
  try {
    const { courseId } = req.params

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    const lectures = await Lecture.find({ courseId }).sort({ createdAt: 1 })
    return res.json(lectures)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get lectures' })
  }
}

export async function deleteLecture(req, res) {
  return res.status(501).json({ error: 'Not implemented' })
}



import mongoose from 'mongoose'
import Review from '../models/Review.js'
import Course from '../models/Course.js'
import User from '../models/User.js'

export async function addReview(req, res) {
  try {
    const { courseId, rating, comment } = req.body
    const numRating = rating == null ? NaN : Number(rating)
    if (!courseId) {
      return res.status(400).json({ ok: false, message: 'courseId is required' })
    }
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ ok: false, message: 'rating must be between 1 and 5' })
    }
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ ok: false, message: 'Course not found' })
    }
    const user = await User.findById(req.user)
    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found' })
    }
    const review = await Review.create({
      course: courseId,
      user: req.user,
      rating: numRating,
      comment: comment != null ? String(comment) : undefined,
    })
    return res.status(201).json({ ok: true, review })
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message || 'Failed to add review' })
  }
}

export async function getReviewsByCourse(req, res) {
  try {
    const { courseId } = req.params
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ ok: false, message: 'Invalid course id' })
    }
    const reviews = await Review.find({ course: courseId })
      .sort({ createdAt: -1 })
      .lean()
    return res.json({ ok: true, reviews })
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message || 'Failed to get reviews' })
  }
}

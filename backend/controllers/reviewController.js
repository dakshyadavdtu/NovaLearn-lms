import Review from '../models/Review.js'

export async function addReview(req, res) {
  try {
    const { courseId, rating, comment } = req.body
    const review = await Review.create({
      course: courseId,
      user: req.user,
      rating: rating == null ? undefined : Number(rating),
      comment: comment != null ? String(comment) : undefined,
    })
    return res.status(201).json({ ok: true, review })
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message || 'Failed to add review' })
  }
}

export async function getReviewsByCourse(req, res) {
  try {
    return res.status(501).json({ error: 'Not implemented' })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get reviews' })
  }
}

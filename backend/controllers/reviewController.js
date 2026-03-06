import Review from '../models/Review.js'

export async function addReview(req, res) {
  try {
    return res.status(501).json({ error: 'Not implemented' })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add review' })
  }
}

export async function getReviewsByCourse(req, res) {
  try {
    return res.status(501).json({ error: 'Not implemented' })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get reviews' })
  }
}

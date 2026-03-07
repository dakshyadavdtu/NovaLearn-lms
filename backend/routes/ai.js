import { Router } from 'express'
import Course from '../models/Course.js'

const router = Router()

router.get('/search', async (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
    if (!q) {
      return res.json([])
    }
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    const courses = await Course.find({
      $or: [
        { title: regex },
        { description: regex },
      ],
    })
      .select('_id title thumbnail ratingAvg ratingCount')
      .lean()
    const results = courses.map((c) => ({
      _id: c._id,
      title: c.title,
      category: null,
      level: null,
      price: null,
      thumbnailUrl: c.thumbnail ?? null,
      ratingAvg: c.ratingAvg ?? null,
      ratingCount: c.ratingCount ?? 0,
    }))
    return res.json(results)
  } catch (err) {
    return res.status(500).json({ error: 'Search failed' })
  }
})

export default router

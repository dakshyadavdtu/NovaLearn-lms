import { Router } from 'express'
import Course from '../models/Course.js'

const router = Router()
const AI_TIMEOUT_MS = 8000

function toSummary(c) {
  return {
    _id: c._id,
    title: c.title,
    category: null,
    level: null,
    price: null,
    thumbnailUrl: c.thumbnail ?? null,
    ratingAvg: c.ratingAvg ?? null,
    ratingCount: c.ratingCount ?? 0,
  }
}

async function fallbackSearch(q) {
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  const courses = await Course.find({
    $or: [{ title: regex }, { description: regex }],
  })
    .select('_id title thumbnail ratingAvg ratingCount')
    .lean()
  return courses.map(toSummary)
}

router.get('/search', async (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
    if (!q) {
      return res.json([])
    }

    const key = process.env.AI_API_KEY
    if (!key) {
      const results = await fallbackSearch(q)
      return res.json(results)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)
    try {
      const prompt = `From the user search query, reply with only a JSON object (no markdown): { "topic": string or null, "category": string or null, "level": string or null, "maxPrice": number or null }. User query: ${q}`
      const res2 = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150,
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (!res2.ok) {
        const results = await fallbackSearch(q)
        return res.json(results)
      }
      const data = await res2.json()
      const raw = data?.choices?.[0]?.message?.content?.trim()
      if (!raw) {
        const results = await fallbackSearch(q)
        return res.json(results)
      }
      let parsed
      try {
        parsed = JSON.parse(raw)
      } catch {
        const start = raw.indexOf('{')
        const end = raw.lastIndexOf('}')
        if (start !== -1 && end !== -1 && end > start) {
          try {
            parsed = JSON.parse(raw.slice(start, end + 1))
          } catch {
            const results = await fallbackSearch(q)
            return res.json(results)
          }
        } else {
          const results = await fallbackSearch(q)
          return res.json(results)
        }
      }
      const topic = typeof parsed?.topic === 'string' ? parsed.topic.trim() : q
      const searchTerm = topic || q
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      const courses = await Course.find({
        $or: [{ title: regex }, { description: regex }],
      })
        .select('_id title thumbnail ratingAvg ratingCount')
        .lean()
      return res.json(courses.map(toSummary))
    } catch (err) {
      clearTimeout(timeoutId)
      const results = await fallbackSearch(q)
      return res.json(results)
    }
  } catch (err) {
    return res.status(500).json({ error: 'Search failed' })
  }
})

export default router

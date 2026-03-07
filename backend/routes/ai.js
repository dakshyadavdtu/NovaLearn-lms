import { Router } from 'express'

const router = Router()

router.get('/search', (req, res) => {
  res.json([])
})

export default router

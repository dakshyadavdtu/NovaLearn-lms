import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { getMe, pingAuth } from '../controllers/userController.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({ route: 'user' })
})

router.get('/me', authMiddleware, getMe)
router.get('/ping-auth', authMiddleware, pingAuth)

export default router

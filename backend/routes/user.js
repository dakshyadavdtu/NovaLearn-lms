import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { getMe, pingAuth, getEnrolledCourses } from '../controllers/userController.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({ route: 'user' })
})

router.get('/me', authMiddleware, getMe)
router.get('/ping-auth', authMiddleware, pingAuth)
router.get('/enrolled', authMiddleware, getEnrolledCourses)

export default router

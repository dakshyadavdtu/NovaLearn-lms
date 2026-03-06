import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { uploadAvatar } from '../middlewares/upload.js'
import { getMe, pingAuth, getEnrolledCourses, updateProfile } from '../controllers/userController.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({ route: 'user' })
})

router.get('/me', authMiddleware, getMe)
router.patch('/profile', authMiddleware, uploadAvatar, updateProfile)
router.get('/ping-auth', authMiddleware, pingAuth)
router.get('/enrolled', authMiddleware, getEnrolledCourses)

export default router

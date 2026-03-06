import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { addReview, getReviewsByCourse } from '../controllers/reviewController.js'

const router = Router()

router.post('/', authMiddleware, addReview)
router.get('/course/:courseId', getReviewsByCourse)

export default router

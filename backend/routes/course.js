import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { educatorOnly } from '../middlewares/educator.js'
import { uploadSingle } from '../middlewares/upload.js'
import {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js'

const router = Router()

router.post('/', authMiddleware, educatorOnly, uploadSingle, createCourse)
router.get('/mine', authMiddleware, educatorOnly, getMyCourses)
router.get('/:id', authMiddleware, getCourseById)
router.patch('/:id', authMiddleware, uploadSingle, updateCourse)
router.delete('/:id', authMiddleware, educatorOnly, deleteCourse)

export default router

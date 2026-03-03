import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { educatorMiddleware } from '../middlewares/educator.js'
import { uploadSingle } from '../utils/upload.js'
import {
  createCourse,
  listMyCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({ route: 'course' })
})

router.use(authMiddleware)
router.use(educatorMiddleware)

router.get('/my', listMyCourses)
router.post('/', uploadSingle, createCourse)
router.get('/:id', getCourse)
router.patch('/:id', uploadSingle, updateCourse)
router.delete('/:id', deleteCourse)

export default router

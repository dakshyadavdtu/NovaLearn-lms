import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { educatorOnly } from '../middlewares/educator.js'
import { uploadLectureVideo } from '../middlewares/upload.js'
import { deleteLecture, updateLecture } from '../controllers/lectureController.js'

const router = Router()

router.patch('/:lectureId', authMiddleware, educatorOnly, uploadLectureVideo, updateLecture)
router.delete('/:lectureId', authMiddleware, educatorOnly, deleteLecture)

export default router


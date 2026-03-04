import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { educatorOnly } from '../middlewares/educator.js'
import { deleteLecture } from '../controllers/lectureController.js'

const router = Router()

router.delete('/:lectureId', authMiddleware, educatorOnly, deleteLecture)

export default router


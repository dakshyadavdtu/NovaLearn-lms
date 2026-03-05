import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { createOrder } from '../controllers/paymentController.js'

const router = Router()

router.post('/create-order', authMiddleware, createOrder)

export default router


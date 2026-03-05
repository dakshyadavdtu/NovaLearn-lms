import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import {
  createOrder,
  verifyPayment,
} from '../controllers/paymentController.js'

const router = Router()

router.post('/create-order', authMiddleware, createOrder)
router.post('/verify', authMiddleware, verifyPayment)

export default router


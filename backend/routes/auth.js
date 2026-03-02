import { Router } from 'express'
import {
  signup,
  login,
  logout,
  sendForgotOtp,
  verifyForgotOtp,
  resetForgotPassword,
} from '../controllers/authController.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({ route: 'auth' })
})

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/forgot/send-otp', sendForgotOtp)
router.post('/forgot/verify', verifyForgotOtp)
router.post('/forgot/reset', resetForgotPassword)

export default router

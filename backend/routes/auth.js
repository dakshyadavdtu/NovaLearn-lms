import { Router } from 'express'
import { signup, login, logout } from '../controllers/authController.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({ route: 'auth' })
})

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

export default router

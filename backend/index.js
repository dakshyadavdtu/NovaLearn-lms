import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDb } from './config/db.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import courseRouter from './routes/course.js'
import lectureRouter from './routes/lecture.js'
import paymentRouter from './routes/payment.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
)

app.get('/', (req, res) => {
  res.send('LMS API')
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/course', courseRouter)
app.use('/api/lectures', lectureRouter)
app.use('/api/payment', paymentRouter)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`LMS API listening on port ${PORT}`)
  connectDb().catch((err) => {
    console.error('Error connecting to database:', err)
  })
})


import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDb } from './config/db.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import courseRouter from './routes/course.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      process.env.CORS_ORIGIN ||
      'http://localhost:5173',
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

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
  connectDb().catch((err) => {
    console.error('Error connecting to database:', err)
  })
})


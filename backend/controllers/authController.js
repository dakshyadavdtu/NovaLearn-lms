import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { signToken } from '../utils/jwt.js'

const COOKIE_NAME = 'token'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days

const isProd = process.env.NODE_ENV === 'production'
const cookieOptions = {
  httpOnly: true,
  maxAge: COOKIE_MAX_AGE,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
}

function toSafeUser(user) {
  if (!user) return null
  const u = user.toObject ? user.toObject() : user
  delete u.password
  return u
}

function validEmail(s) {
  return typeof s === 'string' && s.includes('@') && s.length > 5
}

function validPassword(s) {
  return typeof s === 'string' && s.length >= 6
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body
    if (!name || !validEmail(email) || !validPassword(password)) {
      return res.status(400).json({ error: 'Invalid name, email or password' })
    }
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    const user = await User.create({ name, email, password })
    const token = signToken(user._id.toString())
    res.cookie(COOKIE_NAME, token, cookieOptions)
    return res.status(201).json({ user: toSafeUser(user) })
  } catch (err) {
    return res.status(500).json({ error: 'Signup failed' })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!validEmail(email) || !validPassword(password)) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const token = signToken(user._id.toString())
    res.cookie(COOKIE_NAME, token, cookieOptions)
    return res.json({ user: toSafeUser(user) })
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' })
  }
}

export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, cookieOptions)
  return res.json({ ok: true })
}

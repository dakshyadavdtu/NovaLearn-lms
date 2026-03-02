import User from '../models/User.js'
import Otp from '../models/Otp.js'
import bcrypt from 'bcrypt'
import { signToken } from '../utils/jwt.js'
import { generateOtp } from '../utils/otp.js'
import { sendOtpMail } from '../utils/mailer.js'

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

export async function sendForgotOtp(req, res) {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const otp = generateOtp()
    const expiresAt = Date.now() + 10 * 60 * 1000
    await Otp.create({ email, otp, expiresAt })
    await sendOtpMail(email, otp)
    return res.json({ ok: true, message: 'OTP sent' })
  } catch (err) {
    if (err && err.message === 'Email service not configured') {
      return res.status(500).json({ error: 'Email service not configured' })
    }
    return res.status(500).json({ error: 'Could not send OTP' })
  }
}

export async function verifyForgotOtp(req, res) {
  try {
    const { email, otp } = req.body
    if (!email || !otp) {
      return res
        .status(400)
        .json({ ok: false, error: 'Email and OTP are required' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' })
    }
    const record = await Otp.findOne({ email }).sort({ createdAt: -1 })
    if (!record || record.otp !== otp) {
      return res.status(400).json({ ok: false, error: 'Invalid OTP' })
    }
    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ ok: false, error: 'Expired OTP' })
    }
    return res.json({ ok: true })
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, error: 'Could not verify OTP' })
  }
}

export async function resetForgotPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !validPassword(newPassword)) {
      return res
        .status(400)
        .json({ ok: false, error: 'Email, OTP and valid password are required' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' })
    }
    const record = await Otp.findOne({ email }).sort({ createdAt: -1 })
    if (!record || record.otp !== otp) {
      return res.status(400).json({ ok: false, error: 'Invalid OTP' })
    }
    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ ok: false, error: 'Expired OTP' })
    }
    user.password = newPassword
    await user.save()
    await Otp.deleteMany({ email })
    return res.json({ ok: true })
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, error: 'Could not reset password' })
  }
}

import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'fallback-dev-only'

export function signToken(userId) {
  return jwt.sign({ userId }, secret, { expiresIn: '7d' })
}

export function verifyToken(token) {
  const decoded = jwt.verify(token, secret)
  return decoded
}

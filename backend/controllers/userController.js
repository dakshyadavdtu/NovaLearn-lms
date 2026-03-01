import User from '../models/User.js'

function toSafeUser(user) {
  if (!user) return null
  const u = user.toObject ? user.toObject() : user
  delete u.password
  return u
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user)
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.json({ user: toSafeUser(user) })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get user' })
  }
}

export function pingAuth(req, res) {
  return res.json({ ok: true, userId: req.user })
}

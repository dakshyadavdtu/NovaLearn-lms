import User from '../models/User.js'

export async function educatorOnly(req, res, next) {
  try {
    const user = await User.findById(req.user)
    if (!user || user.role !== 'educator') {
      return res.status(403).json({ error: 'Educator access required' })
    }
    next()
  } catch (err) {
    return res.status(500).json({ error: 'Authorization check failed' })
  }
}

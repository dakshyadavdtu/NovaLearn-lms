import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setUser } from '../redux/userSlice'
import { signup as apiSignup } from '../api/auth'

function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  function validEmail(s) {
    return typeof s === 'string' && s.includes('@') && s.trim().length > 5
  }

  function validPassword(s) {
    return typeof s === 'string' && s.length >= 6
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name?.trim()) {
      toast.error('Name is required')
      return
    }
    if (!validEmail(email)) {
      toast.error('Enter a valid email')
      return
    }
    if (!validPassword(password)) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { user } = await apiSignup({ email, password, name, role })
      dispatch(setUser(user))
      toast.success('Account created')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.error || 'Signup failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow space-y-4"
      >
        <h1 className="text-2xl font-semibold text-slate-900">Sign up</h1>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder="Your name"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2"
            disabled={loading}
          >
            <option value="student">Student</option>
            <option value="educator">Educator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-800 text-white py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-slate-800 underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}

export default SignUp

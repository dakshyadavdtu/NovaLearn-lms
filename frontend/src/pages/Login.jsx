import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setUser } from '../redux/userSlice'
import { login as apiLogin } from '../api/auth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      const { user } = await apiLogin(email, password)
      dispatch(setUser(user))
      toast.success('Logged in')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed'
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
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-800 text-white py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="text-sm text-slate-600">
          No account?{' '}
          <Link to="/signup" className="text-slate-800 underline">
            Sign up
          </Link>
        </p>
        <p className="text-sm text-slate-600">
          <Link to="/forgot-password" className="text-slate-800 underline">
            Forgot password?
          </Link>
        </p>
      </form>
    </main>
  )
}

export default Login

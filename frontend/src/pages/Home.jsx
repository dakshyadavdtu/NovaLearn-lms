import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import { clearUser } from '../redux/userSlice'
import { logout as apiLogout } from '../api/auth'

function Home({ apiBase }) {
  const user = useSelector((state) => state.user?.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [statusText, setStatusText] = useState('Checking backend...')

  useEffect(() => {
    let active = true
    axios
      .get(`${apiBase}/health`)
      .then(() => {
        if (!active) return
        setStatusText('Backend connected')
      })
      .catch(() => {
        if (!active) return
        setStatusText('Backend not reachable')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })
    return () => { active = false }
  }, [apiBase])

  async function handleLogout() {
    try {
      await apiLogout()
      dispatch(clearUser())
      toast.success('Logged out')
    } catch {
      dispatch(clearUser())
      toast.info('Logged out')
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">
        LMS Home
      </h1>
      <p className="text-sm text-slate-700 mb-4">
        {loading ? 'Checking backend...' : statusText}
      </p>
      {user ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-slate-700">Logged in as <span className="font-medium">{user.name}</span></p>
          {user.role === 'educator' && (
            <Link to="/educator" className="px-4 py-2 bg-indigo-600 text-white rounded text-sm">
              Educator Dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-700 text-white rounded text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="text-slate-800 underline">Log in</Link>
          <Link to="/signup" className="text-slate-800 underline">Sign up</Link>
        </div>
      )}
    </main>
  )
}

export default Home

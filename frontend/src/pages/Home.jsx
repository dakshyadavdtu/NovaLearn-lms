import { useEffect, useState } from 'react'
import axios from 'axios'

function Home({ apiBase }) {
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

    return () => {
      active = false
    }
  }, [apiBase])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">
        LMS Home
      </h1>
      <p className="text-sm text-slate-700">
        {loading ? 'Checking backend...' : statusText}
      </p>
    </main>
  )
}

export default Home

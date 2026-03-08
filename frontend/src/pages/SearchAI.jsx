import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { searchAI } from '../api/ai.js'

function SearchAI() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  async function runSearch(q) {
    const term = typeof q === 'string' ? q.trim() : ''
    if (!term) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await searchAI(term)
      setResults(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initial = searchParams.get('q')
    if (initial) {
      setQuery(initial)
      runSearch(initial)
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    await runSearch(q)
    navigate(`/search-ai?q=${encodeURIComponent(q)}`, { replace: true })
  }

  return (
    <main className="min-h-screen p-6 bg-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">AI Search</h1>
        <Link to="/" className="text-sm text-indigo-600 hover:underline">Home</Link>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses..."
          className="border border-slate-300 rounded px-3 py-2 text-slate-900"
        />
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded text-sm w-fit" disabled={loading}>
          Search
        </button>
        <p className="text-xs text-slate-500">Try: &quot;python beginner course under 500&quot;</p>
      </form>
      {loading && <p className="mt-4 text-sm text-slate-600">Loading...</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {results === null && !loading && !error && (
        <p className="mt-4 text-sm text-slate-500">Search to find courses.</p>
      )}
      {results !== null && !loading && (() => {
        const list = Array.isArray(results) ? results : (results?.results ?? [])
        const safeList = list.filter((course) => course && course._id)
        if (safeList.length === 0) {
          return <p className="mt-4 text-sm text-slate-600">No matches.</p>
        }
        return (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-500">{safeList.length} course{safeList.length !== 1 ? 's' : ''} found.</p>
          {safeList.map((course) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50 block"
            >
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded bg-slate-200">
                {(course.thumbnailUrl || course.thumbnail) ? (
                  <img
                    src={course.thumbnailUrl || course.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">No image</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-medium text-slate-900">{course.title || 'Untitled course'}</h2>
                {(course.ratingAvg != null || (course.ratingCount != null && course.ratingCount > 0)) && (
                  <p className="mt-1 text-xs text-slate-600">
                    {course.ratingAvg != null ? `${Number(course.ratingAvg).toFixed(1)} ★` : ''}
                    {course.ratingCount != null && course.ratingCount > 0
                      ? ` · ${course.ratingCount} review${course.ratingCount !== 1 ? 's' : ''}`
                      : ''}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
        )
      })()}
    </main>
  )
}

export default SearchAI

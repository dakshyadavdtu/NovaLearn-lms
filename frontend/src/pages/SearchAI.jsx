import { useState } from 'react'
import { searchAI } from '../api/ai.js'

function SearchAI() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await searchAI(q)
      setResults(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-6 bg-slate-100">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">AI Search</h1>
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
      {loading && <p className="mt-4 text-sm text-slate-600">Searching...</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {results !== null && !loading && <p className="mt-4 text-sm text-slate-600">{results.length} result(s)</p>}
    </main>
  )
}

export default SearchAI

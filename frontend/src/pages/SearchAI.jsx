import { useState } from 'react'

function SearchAI() {
  const [query, setQuery] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: call API and show results
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
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded text-sm w-fit">
          Search
        </button>
        <p className="text-xs text-slate-500">Try: &quot;python beginner course under 500&quot;</p>
      </form>
    </main>
  )
}

export default SearchAI

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyCourses } from '../../api/course.js'

export default function MyCourses() {
  const [courses, setCourses] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMyCourses()
      .then((data) => {
        setCourses(data.courses)
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load courses')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen p-6 bg-slate-50">
        <h1 className="text-xl font-semibold text-slate-800">My Courses</h1>
        <p className="mt-2 text-slate-600">Loading...</p>
      </main>
    )
  }
  if (error) {
    return (
      <main className="min-h-screen p-6 bg-slate-50">
        <h1 className="text-xl font-semibold text-slate-800">My Courses</h1>
        <p className="mt-2 text-red-600">{error}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <h1 className="text-xl font-semibold text-slate-800">My Courses</h1>
      <div className="mt-4 space-y-3">
        {courses.map((c) => (
          <div
            key={c._id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
          >
            <div>
              <h2 className="font-medium text-slate-800">{c.title}</h2>
              {c.description && (
                <p className="mt-1 text-sm text-slate-600 line-clamp-1">{c.description}</p>
              )}
            </div>
            <Link
              to={`/educator/courses/${c._id}/edit`}
              className="text-sm text-indigo-600 hover:underline"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}

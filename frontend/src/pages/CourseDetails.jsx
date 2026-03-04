import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourseById } from '../api/course.js'

export default function CourseDetails() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getCourseById(id)
      .then((data) => {
        setCourse(data)
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load course')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-sm text-slate-600">Loading course...</p>
      </main>
    )
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-sm text-red-600">{error || 'Course not found'}</p>
        <Link to="/" className="mt-3 inline-block text-sm text-indigo-600 hover:underline">
          Back home
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <header className="mx-auto max-w-4xl border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-semibold text-slate-900">{course.title}</h1>
        {course.description && (
          <p className="mt-2 text-sm text-slate-700">{course.description}</p>
        )}
      </header>
      <section className="mx-auto mt-6 max-w-4xl">
        <p className="text-sm text-slate-500">
          Curriculum and preview playback will appear here.
        </p>
      </section>
    </main>
  )
}


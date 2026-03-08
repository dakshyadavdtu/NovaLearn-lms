import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getMyCourses, deleteCourse } from '../../api/course.js'

export default function MyCourses() {
  const [courses, setCourses] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function loadCourses() {
    setLoading(true)
    setError(null)
    getMyCourses()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.courses || [])
        setCourses(list)
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load courses')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCourses()
  }, [])

  async function handleDelete(e, courseId) {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Delete this course?')) return
    try {
      await deleteCourse(courseId)
      setCourses((prev) => (prev || []).filter((c) => c._id !== courseId))
      toast.success('Course deleted')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete course')
    }
  }

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
        {(courses || []).length === 0 ? (
          <p className="text-slate-600">No courses yet. Create one to get started.</p>
        ) : (
          (courses || []).map((c) => (
          <div
            key={c._id}
            className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="h-20 w-28 shrink-0 overflow-hidden rounded bg-slate-200">
              {c.thumbnail ? (
                <img src={c.thumbnail} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                  No image
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-medium text-slate-800">{c.title}</h2>
              {c.description && (
                <p className="mt-1 text-sm text-slate-600 line-clamp-1">{c.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/educator/courses/${c._id}/lectures`}
                className="text-sm text-slate-600 hover:underline"
              >
                Lectures
              </Link>
              <Link
                to={`/educator/courses/${c._id}/edit`}
                className="text-sm text-indigo-600 hover:underline"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={(e) => handleDelete(e, c._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

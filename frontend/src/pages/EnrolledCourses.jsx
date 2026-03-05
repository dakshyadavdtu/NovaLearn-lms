import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEnrolledCourses } from '../api/enrolled.js'

export default function EnrolledCourses() {
  const [courses, setCourses] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getEnrolledCourses()
      .then((list) => {
        setCourses(list)
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load enrolled courses')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-xl font-semibold text-slate-900">My Courses</h1>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="mt-4 space-y-3">
        {courses.map((course) => (
          <Link
            key={course._id}
            to={`/courses/${course._id}`}
            className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50"
          >
            <div className="h-20 w-28 shrink-0 overflow-hidden rounded bg-slate-200">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                  No image
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-medium text-slate-900">
                {course.title || 'Untitled course'}
              </h2>
              {course.description && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                  {course.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}


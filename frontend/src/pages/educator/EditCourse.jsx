import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getCourseById, updateCourse } from '../../api/courses.js'

export default function EditCourse() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    try {
      await updateCourse(id, {
        title,
        description,
        isPublished,
        thumbnailFile: thumbnail ?? undefined,
      })
      toast.success('Course updated')
      navigate('/educator/courses')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!id) return
    getCourseById(id)
      .then((data) => {
        setCourse(data)
        setTitle(data.title ?? '')
        setDescription(data.description ?? '')
        setIsPublished(Boolean(data.isPublished))
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load course')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen p-6 bg-slate-50">
        <h1 className="text-xl font-semibold text-slate-800">Edit Course</h1>
        <p className="mt-2 text-slate-600">Loading...</p>
      </main>
    )
  }
  if (error || !course) {
    return (
      <main className="min-h-screen p-6 bg-slate-50">
        <h1 className="text-xl font-semibold text-slate-800">Edit Course</h1>
        <p className="mt-2 text-red-600">{error || 'Course not found'}</p>
        <Link to="/educator/courses" className="mt-2 inline-block text-indigo-600 hover:underline">Back to My Courses</Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <h1 className="text-xl font-semibold text-slate-800">Edit Course</h1>
      <form className="mt-6 max-w-lg space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-slate-800"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-slate-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="isPublished"
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="rounded border-slate-300"
          />
          <label htmlFor="isPublished" className="text-sm font-medium text-slate-700">Published</label>
        </div>
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-slate-700">New thumbnail (optional)</label>
          {course.thumbnail && (
            <p className="mt-1 text-xs text-slate-500">Current: image set</p>
          )}
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-slate-800"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link to="/educator/courses" className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}

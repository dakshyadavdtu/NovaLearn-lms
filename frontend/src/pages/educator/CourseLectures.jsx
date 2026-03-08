import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { createLecture, getLecturesForCourse, updateLecture, deleteLecture } from '../../api/lecture.js'

export default function CourseLectures() {
  const { courseId } = useParams()
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPreviewFree, setIsPreviewFree] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingLecture, setEditingLecture] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editIsPreviewFree, setEditIsPreviewFree] = useState(false)
  const [editVideoFile, setEditVideoFile] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!courseId) return
    setLoading(true)
    setError(null)
    getLecturesForCourse(courseId)
      .then((data) => {
        setLectures(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load lectures')
      })
      .finally(() => setLoading(false))
  }, [courseId])

  async function handleCreate(e) {
    e.preventDefault()
    if (!courseId || !title.trim()) return
    setSaving(true)
    try {
      await createLecture(courseId, {
        title: title.trim(),
        description: description.trim() || undefined,
        isPreviewFree,
      })
      toast.success('Lecture created')
      setTitle('')
      setDescription('')
      setIsPreviewFree(false)
      const data = await getLecturesForCourse(courseId)
      setLectures(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create lecture')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(lecture) {
    setEditingLecture(lecture)
    setEditTitle(lecture.title || '')
    setEditDescription(lecture.description || '')
    setEditIsPreviewFree(Boolean(lecture.isPreviewFree))
    setEditVideoFile(null)
  }

  function resetEdit() {
    setEditingLecture(null)
    setEditTitle('')
    setEditDescription('')
    setEditIsPreviewFree(false)
    setEditVideoFile(null)
    setUpdating(false)
  }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!editingLecture || !editTitle.trim()) return
    setUpdating(true)
    try {
      await updateLecture(editingLecture._id, {
        title: editTitle.trim(),
        description: editDescription,
        isPreviewFree: editIsPreviewFree,
        videoFile: editVideoFile || undefined,
      })
      toast.success('Lecture updated')
      const data = await getLecturesForCourse(courseId)
      setLectures(Array.isArray(data) ? data : [])
      resetEdit()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update lecture')
      setUpdating(false)
    }
  }

  async function handleDelete(lecture) {
    const confirmed = window.confirm('Delete this lecture? This cannot be undone.')
    if (!confirmed) return

    setDeletingId(lecture._id)
    try {
      await deleteLecture(lecture._id)
      toast.success('Lecture deleted')
      if (editingLecture && editingLecture._id === lecture._id) {
        resetEdit()
      }
      const data = await getLecturesForCourse(courseId)
      setLectures(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete lecture')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Lectures</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage lectures for this course.
          </p>
        </div>
        <Link
          to="/educator/courses"
          className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Back to My Courses
        </Link>
      </div>

      <section className="mt-4 grid gap-8 md:grid-cols-[2fr,1.2fr]">
        <div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Lectures
            </h2>
            {loading ? (
              <p className="mt-2 text-sm text-slate-500">Loading lectures...</p>
            ) : error ? (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            ) : lectures.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No lectures yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {(Array.isArray(lectures) ? lectures : []).map((lecture, idx) => (
                  <li key={lecture?._id ?? idx} className="flex items-center justify-between gap-4 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {lecture?.title ?? 'Untitled'}
                      </p>
                      {lecture.description && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                          {lecture.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {lecture.isPreviewFree && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Preview
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(lecture)}
                        disabled={deletingId === lecture._id}
                        className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === lecture._id ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(lecture)}
                        className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Create lecture
            </h2>
            <form className="mt-4 space-y-4" onSubmit={handleCreate}>
              <div>
                <label
                  htmlFor="lecture-title"
                  className="block text-sm font-medium text-slate-700"
                >
                  Title *
                </label>
                <input
                  id="lecture-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-800"
                />
              </div>
              <div>
                <label
                  htmlFor="lecture-description"
                  className="block text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="lecture-description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-800"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="lecture-preview"
                  type="checkbox"
                  checked={isPreviewFree}
                  onChange={(e) => setIsPreviewFree(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <label
                  htmlFor="lecture-preview"
                  className="text-sm font-medium text-slate-700"
                >
                  Free preview
                </label>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-2 w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save lecture'}
              </button>
            </form>
          </div>
          {editingLecture && (
            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Edit lecture
                </h2>
                <button
                  type="button"
                  onClick={resetEdit}
                  className="text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Editing: <span className="font-mono text-slate-700">{editingLecture.title}</span>
              </p>
              <form className="mt-4 space-y-4" onSubmit={handleUpdate}>
                <div>
                  <label
                    htmlFor="edit-lecture-title"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Title *
                  </label>
                  <input
                    id="edit-lecture-title"
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-lecture-description"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="edit-lecture-description"
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-800"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="edit-lecture-preview"
                    type="checkbox"
                    checked={editIsPreviewFree}
                    onChange={(e) => setEditIsPreviewFree(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <label
                    htmlFor="edit-lecture-preview"
                    className="text-sm font-medium text-slate-700"
                  >
                    Free preview
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="edit-lecture-video"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Video file
                  </label>
                  <input
                    id="edit-lecture-video"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setEditVideoFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-sm text-slate-800"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Uploading a new video will replace the existing one.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={updating}
                  className="mt-2 w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update lecture'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  )


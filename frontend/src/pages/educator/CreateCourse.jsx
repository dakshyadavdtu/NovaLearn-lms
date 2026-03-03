import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createCourse } from '../../api/course.js'

export default function CreateCourse() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState('')
  const [price, setPrice] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title?.trim()) return
    setLoading(true)
    setError(null)
    try {
      await createCourse({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        level: level || undefined,
        price: price === '' ? undefined : price,
        isPublished,
        thumbnailFile: thumbnail ?? undefined,
      })
      toast.success('Course created')
      navigate('/educator/courses')
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create course'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <h1 className="text-xl font-semibold text-slate-800">Create Course</h1>
      <form className="mt-6 max-w-lg space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Title *
          </label>
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
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-slate-800"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-slate-800"
          />
        </div>
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-slate-700">
            Level
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-slate-800"
          >
            <option value="">Select level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700">
            Price
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
          <label htmlFor="isPublished" className="text-sm font-medium text-slate-700">
            Publish course
          </label>
        </div>
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-slate-700">
            Thumbnail
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-slate-800"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </main>
  )
}

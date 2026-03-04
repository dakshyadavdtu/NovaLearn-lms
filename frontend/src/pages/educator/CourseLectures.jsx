import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'

export default function CourseLectures() {
  const { courseId } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPreviewFree, setIsPreviewFree] = useState(false)

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
            <p className="mt-2 text-sm text-slate-500">
              Lecture list will appear here for course <span className="font-mono text-slate-700">{courseId}</span>.
            </p>
          </div>
        </div>
        <div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Create lecture
            </h2>
            <form className="mt-4 space-y-4">
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
                type="button"
                className="mt-2 w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Save lecture
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )


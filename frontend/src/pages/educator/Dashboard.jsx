import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <h1 className="text-xl font-semibold text-slate-800">Educator Dashboard</h1>
      <p className="mt-2 text-slate-600">Welcome. Manage your courses from here.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/educator/courses"
          className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          My Courses
        </Link>
        <Link
          to="/educator/courses/new"
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Create course
        </Link>
        <Link
          to="/"
          className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Home
        </Link>
      </div>
    </main>
  )
}

import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function Profile() {
  const user = useSelector((state) => state.user?.user)
  if (!user) return <Navigate to="/login" replace />

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-2xl font-medium text-slate-600">
                {user.name ? user.name[0].toUpperCase() : '?'}
              </span>
            )}
            <div>
              <p className="text-lg font-medium text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-600">{user.email}</p>
              {user.role && (
                <span className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                  {user.role}
                </span>
              )}
            </div>
          </div>
          {user.bio && (
            <p className="mt-4 text-sm text-slate-700">{user.bio}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/profile/edit"
              className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Edit profile
            </Link>
            <Link
              to="/my-courses"
              className="inline-block rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              My courses
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Navigate } from 'react-router-dom'
import { updateProfile as apiUpdateProfile } from '../api/auth'
import { setUser } from '../redux/userSlice'

export default function EditProfile() {
  const user = useSelector((state) => state.user?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [avatarFile, setAvatarFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!user) return <Navigate to="/login" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const form = new FormData()
      form.append('name', name.trim())
      form.append('bio', bio)
      if (avatarFile) form.append('avatar', avatarFile)
      const data = await apiUpdateProfile(form)
      if (data?.user) dispatch(setUser(data.user))
      toast.success('Profile updated')
      navigate('/profile')
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-semibold text-slate-900">Edit profile</h1>
        <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm"
            required
          />
          <label className="mt-4 block text-sm font-medium text-slate-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <label className="mt-4 block text-sm font-medium text-slate-700">Avatar (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-slate-600"
          />
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <Link
              to="/profile"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}

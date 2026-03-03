import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function EducatorRoute({ children }) {
  const user = useSelector((state) => state.user?.user)
  const loading = useSelector((state) => state.user?.loading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 text-slate-800">Loading...</div>
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (user.role !== 'educator') {
    return <Navigate to="/" replace />
  }
  return children
}

import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.user?.user)
  const loading = useSelector((state) => state.user?.loading)

  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (loading) {
    return <div className="p-4">loading...</div>
  }
  return children
}

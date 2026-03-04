import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Dashboard from './pages/educator/Dashboard.jsx'
import MyCourses from './pages/educator/MyCourses.jsx'
import CreateCourse from './pages/educator/CreateCourse.jsx'
import EditCourse from './pages/educator/EditCourse.jsx'
import CourseLectures from './pages/educator/CourseLectures.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import EducatorRoute from './components/EducatorRoute.jsx'
import { API_BASE } from './config.js'
import { setUser, clearUser, setAuthLoading } from './redux/userSlice'
import { getMe } from './api/auth'

export { API_BASE }

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setAuthLoading(true))
    getMe()
      .then((data) => {
        dispatch(setUser(data.user))
      })
      .catch(() => {
        dispatch(clearUser())
      })
      .finally(() => {
        dispatch(setAuthLoading(false))
      })
  }, [dispatch])

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home apiBase={API_BASE} />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<EducatorRoute><Login /></EducatorRoute>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/educator" element={<EducatorRoute><Dashboard /></EducatorRoute>} />
        <Route path="/educator/courses" element={<EducatorRoute><MyCourses /></EducatorRoute>} />
        <Route path="/educator/courses/new" element={<EducatorRoute><CreateCourse /></EducatorRoute>} />
        <Route path="/educator/courses/:id/edit" element={<EducatorRoute><EditCourse /></EducatorRoute>} />
        <Route
          path="/educator/courses/:courseId/lectures"
          element={
            <EducatorRoute>
              <CourseLectures />
            </EducatorRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" theme="colored" />
    </>
  )
}

export default App

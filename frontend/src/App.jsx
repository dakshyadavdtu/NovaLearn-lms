import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import { API_BASE } from './config.js'

export { API_BASE }

function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<Home apiBase={API_BASE} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
      <ToastContainer position="top-right" theme="colored" />
    </>
  )
}

export default App

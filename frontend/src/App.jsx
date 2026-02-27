import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home apiBase={API_BASE} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

export default App

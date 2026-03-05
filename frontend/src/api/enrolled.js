import axios from 'axios'
import { API_BASE } from '../config.js'

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export async function getEnrolledCourses() {
  const { data } = await api.get('/user/enrolled')
  return Array.isArray(data?.courses) ? data.courses : []
}


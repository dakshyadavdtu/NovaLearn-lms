import axios from 'axios'
import { API_BASE } from '../config.js'

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export async function getReviewsByCourse(courseId) {
  const { data } = await api.get(`/review/course/${courseId}`)
  return data
}

export async function addReview(payload) {
  const { data } = await api.post('/review', payload)
  return data
}

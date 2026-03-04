import axios from 'axios'
import { API_BASE } from '../config.js'

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
})

export async function getLecturesForCourse(courseId) {
  const { data } = await api.get('/lectures', {
    params: { courseId },
  })
  return data
}

export async function createLecture(courseId, payload) {
  const form = new FormData()
  form.append('title', payload.title)
  if (payload.description) form.append('description', payload.description)
  if (payload.isPreviewFree !== undefined) {
    form.append('isPreviewFree', payload.isPreviewFree)
  }
  const { data } = await api.post('/lectures', form, {
    params: { courseId },
    headers: { 'Content-Type': undefined },
  })
  return data
}


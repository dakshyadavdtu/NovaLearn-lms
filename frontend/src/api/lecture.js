import axios from 'axios'
import { API_BASE } from '../config.js'

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
})

export async function getLecturesForCourse(courseId) {
  const { data } = await api.get(`/course/${courseId}/lectures`)
  return data
}

export async function createLecture(courseId, payload) {
  const form = new FormData()
  form.append('title', payload.title)
  if (payload.description) form.append('description', payload.description)
  if (payload.isPreviewFree !== undefined) {
    form.append('isPreviewFree', payload.isPreviewFree)
  }
  const { data } = await api.post(`/course/${courseId}/lectures`, form, {
    headers: { 'Content-Type': undefined },
  })
  return data
}

export async function updateLecture(lectureId, payload) {
  const form = new FormData()
  if (payload.title !== undefined && String(payload.title).trim() !== '') {
    form.append('title', String(payload.title).trim())
  }
  if (payload.description !== undefined) {
    form.append('description', String(payload.description))
  }
  if (payload.isPreviewFree !== undefined) {
    form.append('isPreviewFree', payload.isPreviewFree)
  }
  if (payload.videoFile) {
    form.append('video', payload.videoFile)
  }
  const { data } = await api.patch(`/lectures/${lectureId}`, form, {
    headers: { 'Content-Type': undefined },
  })
  return data
}


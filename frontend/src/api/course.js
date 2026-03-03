import axios from 'axios'
import { API_BASE } from '../config.js'

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export async function getMyCourses() {
  const { data } = await api.get('/course/mine')
  return data
}

export async function createCourse(payload) {
  const form = new FormData()
  form.append('title', payload.title)
  if (payload.description) form.append('description', payload.description)
  if (payload.category) form.append('category', payload.category)
  if (payload.level) form.append('level', payload.level)
  if (payload.price !== '' && payload.price != null) form.append('price', payload.price)
  if (payload.isPublished !== undefined) form.append('isPublished', payload.isPublished)
  if (payload.thumbnailFile) form.append('thumbnailFile', payload.thumbnailFile)
  const { data } = await api.post('/course', form, {
    headers: { 'Content-Type': undefined },
  })
  return data
}

import axios from 'axios'
import { API_BASE } from '../config.js'

const api = axios.create({
  baseURL: `${API_BASE}/api/course`,
  withCredentials: true,
})

export async function listMyCourses() {
  const { data } = await api.get('/my')
  return data
}

export async function getCourse(id) {
  const { data } = await api.get(`/${id}`)
  return data
}

export async function createCourse({ title, description, thumbnailFile }) {
  const form = new FormData()
  form.append('title', title)
  if (description) form.append('description', description)
  if (thumbnailFile) form.append('thumbnail', thumbnailFile)
  const { data } = await api.post('/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateCourse(id, { title, description, published, thumbnailFile }) {
  const form = new FormData()
  if (title !== undefined) form.append('title', title)
  if (description !== undefined) form.append('description', description)
  if (published !== undefined) form.append('published', published)
  if (thumbnailFile) form.append('thumbnail', thumbnailFile)
  const { data } = await api.patch(`/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteCourse(id) {
  const { data } = await api.delete(`/${id}`)
  return data
}

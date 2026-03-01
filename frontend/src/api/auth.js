import axios from 'axios'
import { API_BASE } from '../config.js'

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export async function signup({ email, password, name, role }) {
  const { data } = await api.post('/auth/signup', { email, password, name, role })
  return data
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function logout() {
  const { data } = await api.post('/auth/logout')
  return data
}

export async function getMe() {
  const { data } = await api.get('/user/me')
  return data
}

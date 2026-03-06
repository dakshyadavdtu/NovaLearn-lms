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

export async function updateProfile(formData) {
  const { data } = await api.patch('/user/profile', formData, {
    headers: { 'Content-Type': undefined },
  })
  return data
}

export async function sendForgotOtp(email) {
  const { data } = await api.post('/auth/forgot/send-otp', { email })
  return data
}

export async function verifyForgotOtp(email, otp) {
  const { data } = await api.post('/auth/forgot/verify', { email, otp })
  return data
}

export async function resetForgotPassword({ email, otp, newPassword }) {
  const { data } = await api.post('/auth/forgot/reset', {
    email,
    otp,
    newPassword,
  })
  return data
}

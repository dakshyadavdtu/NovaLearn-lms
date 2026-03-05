import axios from 'axios'
import { API_BASE } from '../config.js'

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export async function createPaymentOrder(courseId) {
  const { data } = await api.post('/payment/create-order', { courseId })
  return data
}


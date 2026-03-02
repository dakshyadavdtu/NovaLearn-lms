import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  sendForgotOtp,
  verifyForgotOtp,
  resetForgotPassword,
} from '../api/auth'

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleNext() {
    if (step === 1) {
      const value = email.trim()
      if (!value || !value.includes('@') || value.length <= 5) {
        toast.error('Enter a valid email')
        return
      }
      setLoading(true)
      try {
        await sendForgotOtp(value)
        toast.success('OTP sent to your email')
        setStep(2)
      } catch (err) {
        const msg = err.response?.data?.error || 'Could not send OTP'
        toast.error(msg)
      } finally {
        setLoading(false)
      }
      return
    }
    if (step === 2) {
      const code = String(otp).trim()
      if (!/^\d{6}$/.test(code)) {
        toast.error('Enter the 6-digit code')
        return
      }
      setLoading(true)
      try {
        await verifyForgotOtp(email, code)
        toast.success('Code verified')
        setStep(3)
      } catch (err) {
        const msg = err.response?.data?.error || 'Could not verify code'
        toast.error(msg)
      } finally {
        setLoading(false)
      }
      return
    }
    if (step === 3) {
      const code = String(otp).trim()
      if (!/^\d{6}$/.test(code)) {
        toast.error('Enter the 6-digit code')
        return
      }
      if (!newPassword || newPassword.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      setLoading(true)
      try {
        await resetForgotPassword({ email, otp: code, newPassword })
        toast.success('Password reset, please sign in')
        navigate('/login')
      } catch (err) {
        const msg = err.response?.data?.error || 'Could not reset password'
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          Forgot password
        </h1>
        <p className="text-sm text-slate-600">
          Step {step} of 3
        </p>
        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2"
              disabled={loading}
            />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
              }
              className="w-full border border-slate-300 rounded px-3 py-2"
              disabled={loading}
            />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2"
                disabled={loading}
              />
            </div>
          </div>
        )}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="text-sm text-slate-700 disabled:opacity-50"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={loading || step === 1}
          >
            Back
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-slate-800 text-white rounded text-sm disabled:opacity-50"
            onClick={handleNext}
            disabled={loading}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  )
}

export default ForgotPassword


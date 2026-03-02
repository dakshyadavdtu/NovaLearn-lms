import { useState } from 'react'

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

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
              onChange={(e) => setOtp(e.target.value)}
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
            onClick={() => setStep((s) => Math.min(3, s + 1))}
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


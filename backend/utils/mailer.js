import nodemailer from 'nodemailer'

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('Email service not configured')
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

export async function sendOtpMail(email, otp) {
  const transporter = createTransporter()
  const { SMTP_FROM, SMTP_USER } = process.env
  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to: email,
    subject: 'Your OTP code',
    text: `Your one-time code is ${otp}. It expires in 10 minutes.`,
  })
}


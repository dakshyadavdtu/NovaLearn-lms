# LMS
A simple learning management system for tutorials and courses.

## Live Demo
https://novalearn-ejzh.onrender.com

## Structure
- frontend/ - React app
- backend/ - Express API

## Features
- Educators can create, edit, and delete courses.
- Course thumbnails support upload with a simple fallback when missing.
- Educators can add, edit, and delete lectures for a course.
- Lecture videos can be uploaded and updated by educators.
- Preview lectures can be played; non-preview lectures show as locked.
- Enroll in courses (payment flow); curriculum unlocks after enrollment. Enrolled courses page lists your courses.
- Course reviews and ratings (enrolled users only).
- Profile editing (name, bio, avatar).
- AI-assisted course search; falls back to text search when no API key is set.

## Run locally
- backend: `cd backend`, install dependencies, run the dev server
- frontend: `cd frontend`, install dependencies, run the dev server
- for file uploads (thumbnails and videos), make sure backend env is configured for your upload provider

## Auth
Signup, login, and logout are wired up; auth uses cookies (httpOnly). The backend expects `JWT_SECRET` in its env (see backend `.env.example`). Without it, token signing falls back to a dev-only default.

The password reset flow uses email OTPs. To send emails in non-dev setups, configure the backend SMTP env vars (see `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, optionally `SMTP_FROM`) before starting the API.

## Env
Both `frontend/` and `backend/` include a `.env.example` file for local configuration.
Copy these to `.env` in each folder and tweak values as needed.
You can usually keep the default local URLs and just adjust `DB_URI` if your Mongo setup differs. AI search uses an optional API key if configured in the backend env.

## Deployment notes
Set env vars on your hosting platform for both backend and frontend. Backend: `PORT`, `FRONTEND_URL` (your deployed frontend URL), `DB_URI`, `JWT_SECRET`. Optional: Cloudinary vars for uploads, SMTP vars for password-reset email, Razorpay keys for payments, `AI_API_KEY` for AI search. Set `NODE_ENV=production` so cookies use secure flags and CORS uses your frontend URL. Frontend: set `VITE_API_URL` to your deployed backend URL, then run `npm run build` and serve the `dist/` output.

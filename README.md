# LMS
A simple learning management system for tutorials and courses.

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
You can usually keep the default local URLs and just adjust `DB_URI` if your Mongo setup differs.

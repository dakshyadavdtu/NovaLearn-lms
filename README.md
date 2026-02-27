# LMS
A simple learning management system for tutorials and courses.

## Structure
- frontend/ - React app
- backend/ - Express API

## Run locally
- backend: `cd backend`, install dependencies, run the dev server
- frontend: `cd frontend`, install dependencies, run the dev server

## Env
Both `frontend/` and `backend/` include a `.env.example` file for local configuration.
Copy these to `.env` in each folder and tweak values as needed.
You can usually keep the default local URLs and just adjust `DB_URI` if your Mongo setup differs.

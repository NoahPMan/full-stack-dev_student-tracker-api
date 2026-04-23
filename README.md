# Project Name

Student Tracker App

## Overview

The Student Tracker App is a work-in-progress application designed to help track and manage
student-related information and activities in an organized way.

## Purpose

Project Setup Phase  
Features and implementation are still being defined.

## Planned Features

- Student profile management
- Tracking academic progress
- Basic reporting or summaries
- User-friendly interface

## User Stories

- As a student, I want to view my courses and assignments in one place so that I can stay organized.
- As a student, I want to track assignment due dates so that I can manage my time effectively.
- As a student, I want to monitor my academic progress so that I understand how I am performing.

## Tech Stack

To be decided

## Contributors

**Team Name: Code Trackers**

- Noah Manaigre
- Muniru Adam
- Kaeden Barta

---

## Sprint 1

### Team Contributions

**Project Setup and Foundation** — _Team_

- **Project initialization with Vite + React + TypeScript** — _Adam_
- **Folder structure setup (components/, pages/, context/, types/)** — _Team_
- **README documentation** — _Team_

**Layout and Navigation** — _Adam_

- **Basic Layout component (Header, Main, Footer structure)** — _Adam_
- **Navigation component with tab highlighting** — _Adam_

**State Management** — _Adam_

- **CourseContext with Context API** — _Kaeden_
- **Shared state setup** — _Kaeden_

**Additional Components** — _Kaeden_

- **Footer component with team information** — _Kaeden_

**Git Workflow** — _Team_

- **Repository setup and branch protection** — _Noah/Team_
- **Feature branch workflow implementation** — _Team_

---

## Sprint 2

### Team Contributions

- **Multi-page navigation** — _Kaeden_
- **Navigation bar design and integration** — _Kaeden_

- **Shared application state across pages** — _Noah_
- **Reusable component development** — _Noah_
- **Local storage for data persistence** — _Noah_
- **Desktop layout improvements and responsive fixes** — _Noah_

- **Footer with team names** — _Kaeden_
- **Notes page development** — _Kaeden_
- **Added note creation, removal, and pinning functionality** — _Kaeden_

- **Sprint review and and PR approval** - _Adam_

### Feature Pages

Our feature pages were planned and built collaboratively, with all team members contributing to their development.

---

## Sprint 3

### Team Contributions

- Removed prop drilling across pages — _Noah_
- Homework service (filter/sort/status/add/remove) — _Noah_
- Repository-only data access (Homework) — _Noah_
- Architecture refactor to CourseContext (UI-only) — _Noah_, _Adam_
- Hooks for homework (useHomework + counts) — _Kaeden_
- Notes repository + service layer (repo → service → hook) — _Kaeden_
- useNotes custom hook (loading/error + refresh pattern) — _Kaeden_
- Notes filtering by courseId + pinned-first sorting — _Kaeden_
- Notes model unified; NoteForm uses Context — _Kaeden_
- Notes pin/remove UI refresh — _Kaeden_
- Merge conflict resolution (T.1 duplicate task) — _Kaeden_
- BrowserRouter in main.tsx; App JSX fixes — _Adam_
- Typecheck/build/Vercel checks — _Adam_
- Architecture doc (I.4) + chain comments/probe (I.3) — _Noah_
- Sprint review and PR approval — _Adam_, _Kaeden_, _Noah_

---

## Sprint 4

### Team Contributions

- T.1 Backend Initial Setup - _Kaeden_
- T.3 Prisma Install - _Noah_
- T.4 CORS setup - _Adam_
- I.1: Back-end Resource Endpoint for Notes - _Adam_
- I.2: Notes Database implementation - _Adam_
- I.3: Frontend integration for Notes - _Adam_
- I.4 Application State Persistence for Notes - _Adam_

---

## Sprint 5

### Team Contributions

- T.1 Clerk setup - _Adam_
- T.3 Back-end User Management - _Adam_
- T.4 User Login/Registration - _Adam_
- I.1 Custom User-Associated Data and Session Management for Notes - _Adam_

---

Sprint 5
Local Setup (T.5)

Prerequisites

Node.js 18+
Docker Desktop (for local PostgreSQL via Docker Compose)
A Clerk app (Publishable + Secret keys) [clerk.com]

Environment Variables


Frontend (frontend/.env.local)


Vite exposes environment variables to the browser only if they start with VITE_ and they are available at import.meta.env.

Create frontend/.env.local:

VITE_API_BASE_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key

Backend (backend/.env)


Create backend/.env:

PORT=3001

# Local database (Docker)

DATABASE_URL=postgresql://postgres:password@localhost:5434/student_tracker_dev

# Clerk (server-side)

CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# CORS allowlist for frontend origin (local)

FRONTEND_URL=http://localhost:5173

# Optional: allow multiple origins (comma-separated)

# FRONTEND_URLS=http://localhost:5173,https://full-stack-dev-student-tracker-api.vercel.app

Running Locally


1. Install project dependencies
From the repo root:


npm install

2. Start the local database (Docker)
From the repo root (where docker-compose.yml lives):

docker compose up -d

Stop it:

docker compose down

3. Run Prisma migrations + generate client
From backend/:

cd backend
npx prisma migrate dev
npx prisma generate


If the database already exists, Prisma may report no pending migrations.

4. Start the backend
From backend/:

npm run dev

5. Start the frontend
In a second terminal:

cd frontend
npm run dev


Local URLs


Frontend: http://localhost:5173
Backend: http://localhost:3001


Open the frontend URL in your browser after both servers are running.


Notes


- Run frontend and backend in separate terminals.
- If Clerk keys are missing or invalid, authentication pages may not load correctly.
- Make sure the Docker container is running before starting the backend.
- If a port is already in use, close any existing local servers first.
- To stop the frontend/backend servers, press Ctrl + C in each terminal.
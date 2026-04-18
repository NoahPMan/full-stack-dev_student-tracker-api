import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import homeworkRoutes from './routes/homework';
import notesRoutes from './routes/notes';
import coursesRoutes from './routes/courses';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// Global middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Initialises Clerk on every request so getAuth() works downstream.
// Does NOT block unauthenticated requests — use requireAuth() on protected routes.
app.use(clerkMiddleware());

// Health
app.get('/', (_req, res) => res.send('Student Tracker API is running'));
app.get('/api/health', (_req, res) =>
  res.json({ status: 'healthy', timestamp: new Date().toISOString() }),
);

// Courses are public (shared catalogue — no auth required)
app.use('/api/v1/courses', coursesRoutes);

// Notes and Homework are user-scoped (requireAuth applied inside each router)
app.use('/api/v1/notes', notesRoutes);
app.use('/api/v1/homework', homeworkRoutes);

// Centralized error handler — must be registered after all routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

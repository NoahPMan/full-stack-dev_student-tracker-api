import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import homeworkRoutes from './routes/homework';
import notesRoutes from './routes/notes';
import coursesRoutes from './routes/courses';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Clerk middleware attaches auth info to requests; protected routes should use requireAuth. [2](https://shadowsmith.com/thoughts/how-to-deploy-an-express-api-to-vercel)
app.use(clerkMiddleware());

app.get('/', (_req, res) => res.send('Student Tracker API is running'));
app.get('/api/health', (_req, res) =>
  res.json({ status: 'healthy', timestamp: new Date().toISOString() }),
);

app.use('/api/v1/courses', coursesRoutes);
app.use('/api/v1/notes', notesRoutes);
app.use('/api/v1/homework', homeworkRoutes);

app.use(errorHandler);

export default app;
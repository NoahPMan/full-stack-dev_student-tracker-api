import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import homeworkRoutes from './routes/homework';
import notesRoutes from './routes/notes';
import coursesRoutes from './routes/courses';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Allow multiple origins (production + preview) via comma-separated env var
const allowedOrigins = (process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? 'http://localhost:5173')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

const corsOptions: cors.CorsOptions = {
    origin: (origin, cb) => {
        // allow non-browser tools (curl/postman) with no Origin header
        if (!origin) return cb(null, true);

        // allow list match
        if (allowedOrigins.includes(origin)) return cb(null, true);

        // allow Vercel preview URLs for your project (optional but useful)
        if (origin.endsWith('.vercel.app') && origin.includes('full-stack-dev-student-tracker')) {
            return cb(null, true);
        }

        return cb(new Error('CORS blocked'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ respond to preflight

app.use(express.json());

// Clerk middleware attaches auth info to requests; protected routes should use requireAuth().
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
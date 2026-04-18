import courseRoutes from './routes/courses';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Routers
import homeworkRoutes from './routes/homework';
import notesRoutes from './routes/notes';
import coursesRoutes from './routes/courses';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/courses', courseRoutes);

app.get("/", (_req, res) => {
  res.send("Student Tracker API is running");
});

app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "healthy", 
    message: "Student Tracker API is operational",
    cors: {
      allowedOrigin: "http://localhost:5173",
      credentialsEnabled: true,
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`✅ CORS enabled for: http://localhost:5173`);
  console.log(`✅ API available at: http://localhost:${PORT}`);
  console.log(`✅ Course API: http://localhost:${PORT}/api/courses`);
});

app.use(express.json());

app.use(cors());

// Health
app.get('/', (_req, res) => {
  res.send('Student Tracker API is running');
});

// API routes
app.use('/api/v1/homework', homeworkRoutes);
app.use('/api/v1/notes', notesRoutes);
app.use('/api/v1/courses', coursesRoutes);

// Start
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
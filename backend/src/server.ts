import cors from "cors";
import express from "express";
import courseRoutes from './routes/courses';

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
  console.log(`✅ CORS enabled for: http://localhost:5173`);
  console.log(`✅ API available at: http://localhost:${port}`);
  console.log(`✅ Course API: http://localhost:${port}/api/courses`);
});
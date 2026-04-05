import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Routers
import homeworkRoutes from './routes/homework';
import notesRoutes from './routes/notes';
import coursesRoutes from './routes/courses';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

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
import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import homeworkRoutes from "./routes/homework";
import notesRoutes from "./routes/notes";
import coursesRoutes from "./routes/courses";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

const allowedOrigins = (process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);

    if (origin.endsWith(".vercel.app") && origin.includes("full-stack-dev-student-tracker")) {
      return cb(null, true);
    }

    return cb(new Error("CORS blocked"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (_req, res) => res.send("Student Tracker API is running"));

app.get("/api/health", (_req, res) =>
  res.json({ status: "healthy", timestamp: new Date().toISOString() }),
);

// ✅ Put version route BEFORE error handler
app.get("/api/version", (_req, res) => {
  res.json({
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    env: process.env.VERCEL_ENV ?? "local",
    time: new Date().toISOString(),
  });
});

app.use("/api/v1/courses", coursesRoutes);
app.use("/api/v1/notes", notesRoutes);
app.use("/api/v1/homework", homeworkRoutes);

// Error handler LAST
app.use(errorHandler);

export default app;
import cors from "cors";
import express from "express";
import notesRoutes from "./routes/notes";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// routes
app.use("/api/notes", notesRoutes);

app.get("/", (_req, res) => {
  res.send("Student Tracker API is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
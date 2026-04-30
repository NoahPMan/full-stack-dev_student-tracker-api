import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  searchCourses,
  getCourseSummary,
} from "../controllers/courseController";

const router = Router();

// Everything here is user-scoped, so require auth
router.use(requireAuth);

// GET /api/v1/courses/search?q=COMP
router.get("/search", searchCourses);

// GET /api/v1/courses
router.get("/", getAllCourses);

// GET /api/v1/courses/:id
router.get("/:id", getCourseById);

// POST /api/v1/courses
router.post("/", createCourse);

// PATCH /api/v1/courses/:id
router.patch("/:id", updateCourse);

// for delete confirmation modal
// GET /api/v1/courses/:id/summary
router.get("/:id/summary", getCourseSummary);

// delete course + unassign homework/notes
// DELETE /api/v1/courses/:id
router.delete("/:id", deleteCourse);

export default router;
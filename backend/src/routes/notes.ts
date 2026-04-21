import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  addNote,
  editNote,
  getNote,
  getNotes,
  removeNote,
} from "../controllers/noteController";
import {
  validateCreateNote,
  validateNoteId,
  validateUpdateNote,
} from "../middleware/validateNote";

const router = Router();

// All note routes are user-scoped and require a valid Clerk session
router.use(requireAuth);

router.get("/", getNotes);
router.get("/:id", validateNoteId, getNote);
router.post("/", validateCreateNote, addNote);
router.put("/:id", validateNoteId, validateUpdateNote, editNote);
router.delete("/:id", validateNoteId, removeNote);

export default router;

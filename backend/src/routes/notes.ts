import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  addNote,
  editNote,
  getNote,
  getNotes,
  removeNote,
} from '../controllers/noteController';
import {
  validateCreateNote,
  validateNoteId,
  validateUpdateNote,
} from '../middleware/validateNote';

const router = Router();

/**
 * Important: allow preflight OPTIONS requests through so the browser can
 * proceed with the real request that includes Authorization.
 * (Your app-level cors + app.options('*', ...) is still recommended.)
 */
router.options('*', (_req, res) => res.sendStatus(204));

// Signed-in only routes
router.get('/', requireAuth, getNotes);
router.get('/:id', requireAuth, validateNoteId, getNote);

router.post('/', requireAuth, validateCreateNote, addNote);
router.put('/:id', requireAuth, validateNoteId, validateUpdateNote, editNote);
router.delete('/:id', requireAuth, validateNoteId, removeNote);

export default router;
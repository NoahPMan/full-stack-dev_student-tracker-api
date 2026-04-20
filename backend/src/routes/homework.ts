import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import * as c from '../controllers/homeworkController';
import { validate } from '../middleware/validate';
import { createHomeworkSchema, updateHomeworkSchema } from '../validations/homework';

const r = Router();

/**
 * Guest-safe list (meets "some functionality available to guest users").
 */
r.get('/', c.getAllPublic);

/**
 * Signed-in user's homework (meets Sprint 5 I.1: token + user-specific data).
 */
r.get('/mine', requireAuth, c.getMine);

/**
 * Writes require auth (recommended).
 */
r.post('/', requireAuth, validate(createHomeworkSchema), c.post);
r.patch('/:id', requireAuth, validate(updateHomeworkSchema), c.patch);
r.delete('/:id', requireAuth, c.del);

export default r;
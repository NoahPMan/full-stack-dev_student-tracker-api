import { Router } from 'express';
import * as c from '../controllers/homeworkController';
import { validate } from '../middleware/validate';
import { createHomeworkSchema, updateHomeworkSchema } from '../validations/homework';

const r = Router();
r.get('/', c.getAll);
r.post('/', validate(createHomeworkSchema), c.post);
r.patch('/:id', validate(updateHomeworkSchema), c.patch);
r.delete('/:id', c.del);

export default r;

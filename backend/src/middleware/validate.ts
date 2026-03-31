import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema): RequestHandler => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  req.body = parsed.data;
  next();
};
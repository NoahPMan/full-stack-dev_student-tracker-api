import { getAuth } from '@clerk/express';
import type { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Allow CORS preflight requests through (no token is sent on OPTIONS)
  if (req.method === 'OPTIONS') return next();

  const { userId } = getAuth(req); // reads auth state from request 
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  req.userId = userId;
  next();
}
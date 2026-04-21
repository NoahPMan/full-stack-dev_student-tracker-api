import { getAuth } from '@clerk/express';
import type { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Allow CORS preflight requests through (no token is sent on OPTIONS)
  if (req.method === 'OPTIONS') return next();

  const { userId: clerkId } = getAuth(req);
  console.log('requireAuth - Clerk userId:', clerkId);

  if (!clerkId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}
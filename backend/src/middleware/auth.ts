import { getAuth } from '@clerk/express';
import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware that requires a valid Clerk session token.
 * Reads the token from the Authorization header (Bearer <token>),
 * validated by clerkMiddleware() registered globally in server.ts.
 * Returns 401 if the request is not authenticated.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const { userId: clerkId } = getAuth(req);
  console.log('requireAuth - Clerk userId:', clerkId);
  if (!clerkId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

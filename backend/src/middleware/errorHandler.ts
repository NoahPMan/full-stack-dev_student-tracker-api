import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = (err as any)?.status ?? 500;
  const message = err instanceof Error ? err.message : 'Internal server error';

  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.path} → ${status}`,
    '\n ',
    err instanceof Error ? err.stack : err,
  );

  res.status(status).json({ error: message });
}

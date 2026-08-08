import type { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  void _next;

  console.error('Unhandled request error', {
    method: req.method,
    path: req.originalUrl,
    error: err,
  });

  // Do not expose exception messages or stack traces to API clients.
  res.status(500).json({ error: 'Internal server error' });
}

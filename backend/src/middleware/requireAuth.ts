import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, type AdminTokenPayload } from '../config/jwt';

export interface AuthedRequest extends Request {
  admin?: AdminTokenPayload;
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    // jwt.verify's return type doesn't know the shape of our own payload — safe here
    // since this app only ever signs tokens with { sub, email } (see auth.controller.ts).
    req.admin = jwt.verify(token, JWT_SECRET) as unknown as AdminTokenPayload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export default requireAuth;

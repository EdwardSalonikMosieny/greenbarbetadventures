import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/prisma';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt';
import type { AuthedRequest } from '../middleware/requireAuth';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Same message for "no such admin" and "wrong password" — don't leak which one failed.
const INVALID_CREDENTIALS = 'Invalid email or password';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as z.infer<typeof loginSchema>;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    res.status(401).json({ error: INVALID_CREDENTIALS });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) {
    res.status(401).json({ error: INVALID_CREDENTIALS });
    return;
  }

  const token = jwt.sign({ sub: admin.id, email: admin.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

  res.json({
    token,
    admin: { id: admin.id, email: admin.email, name: admin.name },
  });
}

export async function me(req: AuthedRequest, res: Response) {
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin!.sub },
    select: { id: true, email: true, name: true },
  });

  if (!admin) {
    res.status(401).json({ error: 'Admin no longer exists' });
    return;
  }

  res.json({ admin });
}

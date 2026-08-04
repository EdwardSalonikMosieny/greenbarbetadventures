import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import validateBody from '../middleware/validate';
import asyncHandler from '../middleware/asyncHandler';
import requireAuth from '../middleware/requireAuth';
import { login, loginSchema, me } from '../controllers/auth.controller';

const router = Router();

// Tighter than the public form limiters — this is the credential-guessing surface.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, validateBody(loginSchema), asyncHandler(login));
router.get('/me', requireAuth, asyncHandler(me));

export default router;

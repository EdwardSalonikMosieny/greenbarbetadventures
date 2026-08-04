import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import validateBody from '../middleware/validate';
import asyncHandler from '../middleware/asyncHandler';
import { subscribe, subscribeSchema } from '../controllers/newsletter.controller';

const router = Router();

// Public, unauthenticated write endpoint — rate-limited against scripted signup spam.
const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', subscribeLimiter, validateBody(subscribeSchema), asyncHandler(subscribe));

export default router;

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import validateBody from '../middleware/validate';
import asyncHandler from '../middleware/asyncHandler';
import {
  createTestimonial,
  createTestimonialSchema,
  listApprovedTestimonials,
} from '../controllers/testimonial.controller';

const router = Router();

// Public, unauthenticated write endpoint — rate-limited against scripted spam,
// same as newsletter/booking-inquiries.
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/', asyncHandler(listApprovedTestimonials));
router.post('/', submitLimiter, validateBody(createTestimonialSchema), asyncHandler(createTestimonial));

export default router;

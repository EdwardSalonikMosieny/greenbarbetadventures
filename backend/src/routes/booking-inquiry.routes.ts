import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import validateBody from '../middleware/validate';
import asyncHandler from '../middleware/asyncHandler';
import { createBookingInquiry, createBookingInquirySchema } from '../controllers/booking-inquiry.controller';

const router = Router();

// Public, unauthenticated write endpoint — rate-limited against scripted spam.
const bookingInquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/',
  bookingInquiryLimiter,
  validateBody(createBookingInquirySchema),
  asyncHandler(createBookingInquiry),
);

export default router;

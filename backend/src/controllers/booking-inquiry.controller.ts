import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';

export const createBookingInquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
  // The frontend still sources tour content from static data (see data/tours.ts) rather
  // than a live GET /tours endpoint, so it can only send us the tour's slug — this
  // resolves it to the real Tour row's id for the BookingInquiry relation below.
  tourSlug: z.string().trim().optional(),
  preferredDates: z.string().trim().min(2, 'Let us know your preferred dates'),
  numberOfTravelers: z.coerce.number().int().min(1, 'At least 1 traveler'),
  message: z.string().trim().min(10, 'Tell us a little more about your trip'),
});

export async function createBookingInquiry(req: Request, res: Response) {
  const { tourSlug, ...data } = req.body as z.infer<typeof createBookingInquirySchema>;

  const tour = tourSlug ? await prisma.tour.findUnique({ where: { slug: tourSlug } }) : null;

  const inquiry = await prisma.bookingInquiry.create({
    data: {
      ...data,
      tourId: tour?.id ?? null,
    },
  });

  res.status(201).json(inquiry);
}

import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';

export const createTestimonialSchema = z.object({
  customerName: z.string().trim().min(2, 'Enter your name'),
  customerEmail: z.string().trim().toLowerCase().email('Enter a valid email address'),
  rating: z.coerce.number().int().min(1).max(5),
  quote: z.string().trim().min(10, 'Tell us a bit more about your trip').max(1000),
  // Same pattern as BookingInquiry.tourSlug — the frontend only knows the static tour
  // slug, not the live Tour row's id.
  tourSlug: z.string().trim().optional(),
});

export async function createTestimonial(req: Request, res: Response) {
  const { tourSlug, ...data } = req.body as z.infer<typeof createTestimonialSchema>;

  const tour = tourSlug ? await prisma.tour.findUnique({ where: { slug: tourSlug } }) : null;

  // isApproved defaults to false (see schema) — nothing a visitor submits appears on
  // the site until an admin reviews and approves it.
  const testimonial = await prisma.testimonial.create({
    data: {
      ...data,
      tourId: tour?.id ?? null,
    },
  });

  res.status(201).json({
    id: testimonial.id,
    message: 'Thanks for sharing your experience! It will appear on the site once reviewed.',
  });
}

export async function listApprovedTestimonials(_req: Request, res: Response) {
  // Explicit `select` (not `include`) — customerEmail is collected for the owner's own
  // follow-up/verification only and must never reach this public, unauthenticated endpoint.
  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    select: {
      id: true,
      customerName: true,
      customerPhotoUrl: true,
      rating: true,
      quote: true,
      createdAt: true,
      tour: { select: { title: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(testimonials);
}

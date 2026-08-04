import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../config/prisma';

const itineraryDaySchema = z.object({
  day: z.coerce.number().int().min(1),
  summary: z.string().trim().min(1),
});

export const tourSchema = z.object({
  title: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  description: z.string().trim().min(10),
  itinerary: z.array(itineraryDaySchema).min(1, 'Add at least one itinerary day'),
  durationDays: z.coerce.number().int().min(1),
  durationNights: z.coerce.number().int().min(0),
  priceUsd: z.coerce.number().positive(),
  discountPriceUsd: z.coerce.number().positive().nullable(),
  tourType: z.enum(['WILDLIFE_SAFARI', 'CULTURAL', 'LUXURY', 'MOUNTAIN_CLIMBING']),
  destinationId: z.string().trim().min(1, 'Select a destination'),
  coverImageUrl: z.string().trim().min(1, 'Upload a cover image'),
  galleryImageUrls: z.array(z.string().trim().min(1)).default([]),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

const include = { destination: true, galleryImages: true } as const;

export async function list(_req: Request, res: Response) {
  const tours = await prisma.tour.findMany({ include, orderBy: { title: 'asc' } });
  res.json(tours);
}

export async function getOne(req: Request, res: Response) {
  const tour = await prisma.tour.findUnique({ where: { id: req.params.id! }, include });
  if (!tour) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(tour);
}

export async function create(req: Request, res: Response) {
  const { galleryImageUrls, ...data } = req.body as z.infer<typeof tourSchema>;

  const tour = await prisma.tour.create({
    data: {
      ...data,
      galleryImages: { create: galleryImageUrls.map((imageUrl) => ({ imageUrl })) },
    },
    include,
  });
  res.status(201).json(tour);
}

export async function update(req: Request, res: Response) {
  const { galleryImageUrls, ...data } = req.body as z.infer<typeof tourSchema>;
  const id = req.params.id!;

  // Simplest correct sync for an admin tool used at low frequency: replace the full
  // gallery set rather than diffing which URLs were added/removed.
  const tour = await prisma.tour.update({
    where: { id },
    data: {
      ...data,
      galleryImages: {
        deleteMany: {},
        create: galleryImageUrls.map((imageUrl) => ({ imageUrl })),
      },
    },
    include,
  });
  res.json(tour);
}

export async function remove(req: Request, res: Response) {
  await prisma.tour.delete({ where: { id: req.params.id! } });
  res.status(204).send();
}

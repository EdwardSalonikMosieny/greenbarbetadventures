import { z } from 'zod';
import prisma from '../../config/prisma';
import createCrudRouter from '../../lib/createCrudRouter';

const destinationSchema = z.object({
  name: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  description: z.string().trim().min(10),
  heroImageUrl: z.string().trim().min(1, 'Upload a hero image'),
  region: z.string().trim().min(2),
});

const router = createCrudRouter({
  delegate: prisma.destination,
  createSchema: destinationSchema,
  updateSchema: destinationSchema,
  orderBy: { name: 'asc' },
});

export default router;

import { z } from 'zod';
import prisma from '../../config/prisma';
import createCrudRouter from '../../lib/createCrudRouter';

const experienceSchema = z.object({
  title: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  coverImageUrl: z.string().trim().min(1, 'Upload a cover image'),
  body: z.string().trim().min(10),
  // Nullable: unpublished (draft) stories have no publish date yet.
  publishedAt: z.coerce.date().nullable(),
});

const router = createCrudRouter({
  delegate: prisma.experience,
  createSchema: experienceSchema,
  updateSchema: experienceSchema,
  orderBy: { title: 'asc' },
});

export default router;

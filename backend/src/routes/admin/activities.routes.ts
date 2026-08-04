import { z } from 'zod';
import prisma from '../../config/prisma';
import createCrudRouter from '../../lib/createCrudRouter';

const activitySchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(10),
  imageUrl: z.string().trim().min(1, 'Upload an image'),
});

const router = createCrudRouter({
  delegate: prisma.activity,
  createSchema: activitySchema,
  updateSchema: activitySchema,
  orderBy: { title: 'asc' },
});

export default router;

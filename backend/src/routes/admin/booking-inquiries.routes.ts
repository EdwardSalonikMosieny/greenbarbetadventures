import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../config/prisma';
import requireAuth from '../../middleware/requireAuth';
import validateBody from '../../middleware/validate';
import asyncHandler from '../../middleware/asyncHandler';

const router = Router();
router.use(requireAuth);

const statusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'CONFIRMED', 'CLOSED']),
});

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const inquiries = await prisma.bookingInquiry.findMany({
      include: { tour: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(inquiries);
  }),
);

router.patch(
  '/:id/status',
  validateBody(statusSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body as z.infer<typeof statusSchema>;
    const inquiry = await prisma.bookingInquiry.update({
      where: { id: req.params.id! },
      data: { status },
    });
    res.json(inquiry);
  }),
);

export default router;

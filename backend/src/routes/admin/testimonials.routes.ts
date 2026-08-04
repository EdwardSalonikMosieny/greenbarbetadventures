import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../config/prisma';
import requireAuth from '../../middleware/requireAuth';
import validateBody from '../../middleware/validate';
import asyncHandler from '../../middleware/asyncHandler';

const router = Router();
router.use(requireAuth);

const approvalSchema = z.object({
  isApproved: z.boolean(),
});

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const testimonials = await prisma.testimonial.findMany({
      include: { tour: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(testimonials);
  }),
);

router.patch(
  '/:id/approval',
  validateBody(approvalSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { isApproved } = req.body as z.infer<typeof approvalSchema>;
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id! },
      data: { isApproved },
    });
    res.json(testimonial);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.testimonial.delete({ where: { id: req.params.id! } });
    res.status(204).send();
  }),
);

export default router;

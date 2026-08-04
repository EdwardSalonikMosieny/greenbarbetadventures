import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../../config/prisma';
import requireAuth from '../../middleware/requireAuth';
import asyncHandler from '../../middleware/asyncHandler';

const router = Router();
router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });
    res.json(subscribers);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.newsletterSubscriber.delete({ where: { id: req.params.id! } });
    res.status(204).send();
  }),
);

export default router;

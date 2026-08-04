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
    const [
      totalTours,
      publishedTours,
      totalDestinations,
      totalActivities,
      totalExperiences,
      totalSubscribers,
      inquiriesByStatus,
      totalTestimonials,
      pendingTestimonials,
    ] = await Promise.all([
      prisma.tour.count(),
      prisma.tour.count({ where: { isPublished: true } }),
      prisma.destination.count(),
      prisma.activity.count(),
      prisma.experience.count(),
      prisma.newsletterSubscriber.count(),
      prisma.bookingInquiry.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { isApproved: false } }),
    ]);

    const statusCounts = { NEW: 0, CONTACTED: 0, CONFIRMED: 0, CLOSED: 0 };
    for (const row of inquiriesByStatus) {
      statusCounts[row.status] = row._count.status;
    }

    res.json({
      totalTours,
      publishedTours,
      totalDestinations,
      totalActivities,
      totalExperiences,
      totalSubscribers,
      totalInquiries: Object.values(statusCounts).reduce((sum, n) => sum + n, 0),
      inquiriesByStatus: statusCounts,
      totalTestimonials,
      pendingTestimonials,
    });
  }),
);

export default router;

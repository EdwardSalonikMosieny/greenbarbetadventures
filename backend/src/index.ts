import path from 'node:path';
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import newsletterRoutes from './routes/newsletter.routes';
import bookingInquiryRoutes from './routes/booking-inquiry.routes';
import testimonialRoutes from './routes/testimonial.routes';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import adminDestinationsRoutes from './routes/admin/destinations.routes';
import adminActivitiesRoutes from './routes/admin/activities.routes';
import adminExperiencesRoutes from './routes/admin/experiences.routes';
import adminToursRoutes from './routes/admin/tours.routes';
import adminBookingInquiriesRoutes from './routes/admin/booking-inquiries.routes';
import adminNewsletterSubscribersRoutes from './routes/admin/newsletter-subscribers.routes';
import adminTestimonialsRoutes from './routes/admin/testimonials.routes';
import adminStatsRoutes from './routes/admin/stats.routes';

const app = express();
const port = process.env.PORT ?? 4000;

app.use(
  helmet({
    // Uploaded tour/destination photos are public marketing images served to the
    // frontend's separate origin — same-origin (helmet's default) would block them.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
// FRONTEND_ORIGIN is comma-separated so both the apex and www domains (served
// separately from the API under the split-hosting setup) can be allowed at once.
const allowedOrigins = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());
app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1/booking-inquiries', bookingInquiryRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/admin/destinations', adminDestinationsRoutes);
app.use('/api/v1/admin/activities', adminActivitiesRoutes);
app.use('/api/v1/admin/experiences', adminExperiencesRoutes);
app.use('/api/v1/admin/tours', adminToursRoutes);
app.use('/api/v1/admin/booking-inquiries', adminBookingInquiriesRoutes);
app.use('/api/v1/admin/newsletter-subscribers', adminNewsletterSubscribersRoutes);
app.use('/api/v1/admin/testimonials', adminTestimonialsRoutes);
app.use('/api/v1/admin/stats', adminStatsRoutes);

// Catch-all error handler — must be registered last, after every route. The unused
// 4th param is required: Express only treats a handler as error-handling middleware
// when it has arity 4.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next;
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Green Barbet Adventures API listening on port ${port}`);
});

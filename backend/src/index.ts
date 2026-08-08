import path from 'node:path';
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
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
import { configureProxyTrust } from './config/http';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

const app = express();
const port = Number.parseInt(process.env.PORT ?? '4000', 10);
const host = process.env.HOST ?? '0.0.0.0';

// Nginx is the only process allowed to connect to Express in production. Nginx
// validates Cloudflare as its upstream proxy and replaces X-Forwarded-For with
// the restored visitor address; trusting only loopback keeps direct clients from
// spoofing the address used by express-rate-limit.
configureProxyTrust(app);
app.use(requestLogger);

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

// Error middleware must remain last so it receives failures from every route.
app.use(errorHandler);

app.listen(port, host, () => {
  console.log(`Green Barbet Adventures API listening on ${host}:${port}`);
  // PM2 runs this app with `wait_ready: true`, so a reload only counts as
  // successful once the socket is actually accepting connections. Without this
  // signal PM2 stalls for the full `listen_timeout` on every deploy.
  process.send?.('ready');
});

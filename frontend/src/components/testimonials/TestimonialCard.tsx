import { Link } from 'react-router-dom';
import { TOURS, TOUR_TYPE_TO_CATEGORY_SLUG } from '../../data/tours';
import styles from './TestimonialCard.module.css';

export interface Testimonial {
  id: string;
  customerName: string;
  customerPhotoUrl: string | null;
  rating: number;
  quote: string;
  tour: { title: string; slug: string } | null;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function initials(name: string): string {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  // The API only gives us the tour's title/slug, not its category — look the static
  // tour up by slug so the link can still go to the right /tours/:category/:slug route.
  const fullTour = testimonial.tour ? TOURS.find((t) => t.slug === testimonial.tour!.slug) : null;

  return (
    <article className={styles.card}>
      <div className={styles.stars} aria-label={`${testimonial.rating} out of 5 stars`}>
        {'★'.repeat(testimonial.rating)}
        <span className={styles.starsMuted}>{'★'.repeat(5 - testimonial.rating)}</span>
      </div>

      <p className={styles.quote}>“{testimonial.quote}”</p>

      <div className={styles.footer}>
        <span className={styles.avatar} aria-hidden="true">
          {initials(testimonial.customerName)}
        </span>
        <div className={styles.footerText}>
          <span className={styles.name}>{testimonial.customerName}</span>
          {fullTour && (
            <Link
              to={`/tours/${TOUR_TYPE_TO_CATEGORY_SLUG[fullTour.tourType]}/${fullTour.slug}`}
              className={styles.tourLink}
            >
              {fullTour.title}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default TestimonialCard;

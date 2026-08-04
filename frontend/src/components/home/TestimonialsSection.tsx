import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import Section from '../layout/Section';
import TestimonialsGrid from '../testimonials/TestimonialsGrid';
import type { Testimonial } from '../testimonials/TestimonialCard';
import FadeIn from '../common/FadeIn';
import { get } from '../../lib/apiClient';
import styles from './TestimonialsSection.module.css';

// id="testimonials" is the target of the Hero's "4.9 from 600+ happy travelers"
// trust-row link — a real on-page reviews section, not a link to an external site.
// Fetches live, admin-approved testimonials — including ones guests submit themselves
// via /share-your-experience — rather than static seed data.
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    get<Testimonial[]>('/testimonials')
      .then(setTestimonials)
      .catch(() => setTestimonials([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Section id="testimonials" background="cream" className={styles.section}>
      <Container>
        <FadeIn className={styles.header}>
          <h2>What Travelers Say</h2>
          <p>Real trips, real routes — reviews from guests across our safari, coastal, and summit tours.</p>
        </FadeIn>

        {!isLoading && testimonials.length > 0 && <TestimonialsGrid testimonials={testimonials} />}
        {!isLoading && testimonials.length === 0 && (
          <p className={styles.empty}>Be the first to share how your trip went.</p>
        )}

        <div className={styles.cta}>
          <Link to="/share-your-experience" className={styles.ctaLink}>
            Been on a trip with us? Share your experience →
          </Link>
        </div>
      </Container>
    </Section>
  );
}

export default TestimonialsSection;

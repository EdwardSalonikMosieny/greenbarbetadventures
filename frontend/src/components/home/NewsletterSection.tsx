import { lazy, Suspense } from 'react';
import Container from '../layout/Container';
import Section from '../layout/Section';
import FadeIn from '../common/FadeIn';
import styles from './NewsletterSection.module.css';

// Lazy: React Hook Form + Zod (~40kB) only need to load for whoever scrolls this far,
// not as part of every page's critical bundle. The fallback reserves the form's
// approximate real height so swapping in the real form doesn't shift the Footer below it.
const NewsletterForm = lazy(() => import('../newsletter/NewsletterForm'));

function NewsletterSection() {
  return (
    <Section background="cream">
      <Container>
        <FadeIn className={styles.layout}>
          <div className={styles.textCol}>
            <h2>Never Miss a New Route</h2>
            <p>
              New tour packages, seasonal safari tips, and real trip stories from Green Barbet
              guests — straight to your inbox, no spam.
            </p>
          </div>
          <Suspense fallback={<div className={styles.formPlaceholder} />}>
            <NewsletterForm />
          </Suspense>
        </FadeIn>
      </Container>
    </Section>
  );
}

export default NewsletterSection;

import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import useSeo from '../lib/useSeo';
import styles from './NotFound.module.css';

function NotFound() {
  useSeo({
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist.",
    noindex: true,
  });

  return (
    <Section background="cream">
      <Container>
        <div className={styles.wrap}>
          <span className={styles.code}>404</span>
          <h1>This trail doesn&rsquo;t lead anywhere</h1>
          <p>
            The page you&rsquo;re looking for may have moved or no longer exists. Here are a few
            places to pick the route back up.
          </p>
          <div className={styles.links}>
            <Link to="/" className={styles.primaryLink}>
              Back to Home
            </Link>
            <Link to="/tours" className={styles.secondaryLink}>
              Browse Tours
            </Link>
            <Link to="/contact" className={styles.secondaryLink}>
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default NotFound;

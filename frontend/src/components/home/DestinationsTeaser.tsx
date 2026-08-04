import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import Section from '../layout/Section';
import DestinationsGrid from '../destinations/DestinationsGrid';
import FadeIn from '../common/FadeIn';
import { DESTINATIONS } from '../../data/destinations';
import styles from './DestinationsTeaser.module.css';

const FEATURED = DESTINATIONS.filter((d) => d.isFeatured);

function DestinationsTeaser() {
  return (
    <Section background="cream">
      <Container>
        <FadeIn className={styles.header}>
          <h2>Real Destinations, Real Kenya</h2>
          <p>Every destination leaves a unique memory — from savanna plains to coral reefs.</p>
        </FadeIn>

        <DestinationsGrid destinations={FEATURED} />

        <div className={styles.viewAll}>
          <Link to="/destinations" className={styles.viewAllLink}>
            View All Destinations →
          </Link>
        </div>
      </Container>
    </Section>
  );
}

export default DestinationsTeaser;

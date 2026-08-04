import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import Section from '../layout/Section';
import ToursGrid from '../tours/ToursGrid';
import FadeIn from '../common/FadeIn';
import { TOURS } from '../../data/tours';
import styles from './ToursTeaser.module.css';

const FEATURED = TOURS.filter((t) => t.isFeatured);

function ToursTeaser() {
  return (
    <Section background="cream">
      <Container>
        <FadeIn className={styles.header}>
          <h2>Sample Tour Packages</h2>
          <p>Real itineraries, from short safaris to week-long circuits.</p>
        </FadeIn>

        <ToursGrid tours={FEATURED} />

        <div className={styles.viewAll}>
          <Link to="/tours" className={styles.viewAllLink}>
            View All Tours →
          </Link>
        </div>
      </Container>
    </Section>
  );
}

export default ToursTeaser;

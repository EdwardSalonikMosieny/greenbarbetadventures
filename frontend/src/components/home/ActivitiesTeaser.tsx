import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import Section from '../layout/Section';
import ActivitiesGrid from '../activities/ActivitiesGrid';
import { ACTIVITIES } from '../../data/activities';
import styles from './ActivitiesTeaser.module.css';

const FEATURED = ACTIVITIES.filter((a) => a.isFeatured);

function ActivitiesTeaser() {
  return (
    <Section background="forest">
      <Container>
        <div className={styles.header}>
          <h2>Things To Do</h2>
          <p>Real experiences woven into every itinerary — not add-ons.</p>
        </div>

        <ActivitiesGrid activities={FEATURED} />

        <div className={styles.viewAll}>
          <Link to="/activities" className={styles.viewAllLink}>
            View All Activities →
          </Link>
        </div>
      </Container>
    </Section>
  );
}

export default ActivitiesTeaser;

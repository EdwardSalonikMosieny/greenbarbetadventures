import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import ActivitiesGrid from '../components/activities/ActivitiesGrid';
import FadeIn from '../components/common/FadeIn';
import useSeo from '../lib/useSeo';
import { ACTIVITIES } from '../data/activities';
import styles from './Activities.module.css';

function Activities() {
  useSeo({
    title: 'Activities',
    description:
      'Game drives, Mount Kenya trekking, rhino tracking, cultural village visits, and coastal experiences woven into every Green Barbet Adventures itinerary.',
  });

  return (
    <Section background="cream">
      <Container>
        <FadeIn className={styles.intro}>
          <h1>Activities</h1>
          <p>Real, on-the-ground experiences woven into every itinerary — not add-ons.</p>
        </FadeIn>

        <ActivitiesGrid activities={ACTIVITIES} />
      </Container>
    </Section>
  );
}

export default Activities;

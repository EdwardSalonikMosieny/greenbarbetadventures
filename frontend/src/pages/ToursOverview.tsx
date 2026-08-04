import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import ToursGrid from '../components/tours/ToursGrid';
import FadeIn from '../components/common/FadeIn';
import useSeo from '../lib/useSeo';
import { TOURS } from '../data/tours';
import styles from './ToursOverview.module.css';

function ToursOverview() {
  useSeo({
    title: 'Tours',
    description:
      "Real Kenya tour packages — wildlife safaris, cultural tours, luxury escapes, and Mount Kenya climbs, from short breaks to week-long circuits.",
  });

  return (
    <Section background="cream">
      <Container>
        <FadeIn className={styles.intro}>
          <h1>Tours</h1>
          <p>Real itineraries, from short safaris to week-long circuits.</p>
        </FadeIn>
        <ToursGrid tours={TOURS} />
      </Container>
    </Section>
  );
}

export default ToursOverview;

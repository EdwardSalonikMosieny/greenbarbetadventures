import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import DestinationsGrid from '../components/destinations/DestinationsGrid';
import FadeIn from '../components/common/FadeIn';
import useSeo from '../lib/useSeo';
import { DESTINATIONS } from '../data/destinations';
import styles from './Destinations.module.css';

function Destinations() {
  useSeo({
    title: 'Destinations',
    description:
      "Explore Kenya's parks, reserves, and coastline with Green Barbet Adventures — from Samburu and the Masai Mara to Mount Kenya and Diani.",
  });

  return (
    <Section background="cream">
      <Container>
        <FadeIn className={styles.intro}>
          <h1>Destinations</h1>
          <p>Explore Kenya like never before — every destination leaves a unique memory.</p>
        </FadeIn>
        <DestinationsGrid destinations={DESTINATIONS} />
      </Container>
    </Section>
  );
}

export default Destinations;

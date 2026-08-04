import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import Section from '../layout/Section';
import AnimatedCounter from '../common/AnimatedCounter';
import FadeIn from '../common/FadeIn';
import styles from './AboutTeaser.module.css';

function AboutTeaser() {
  return (
    <Section background="forest">
      <Container>
        <div className={styles.layout}>
          <FadeIn className={styles.textCol}>
            <h2>Based at the Foot of Mount Kenya</h2>
            <p>
              From Naromoru, we have guided over 600 travelers through Kenya’s parks, conservancies,
              and coastline — every itinerary built around the guest, not a template.
            </p>
            <Link to="/about" className={styles.link}>
              Learn More About Us →
            </Link>
          </FadeIn>

          <FadeIn className={styles.counterBlock} delay={0.15}>
            <span className={styles.counterNumber}>
              <AnimatedCounter target={600} suffix="+" />
            </span>
            <span className={styles.counterLabel}>Happy travelers</span>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}

export default AboutTeaser;

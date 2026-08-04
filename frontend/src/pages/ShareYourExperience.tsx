import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import TestimonialSubmissionForm from '../components/testimonials/TestimonialSubmissionForm';
import FadeIn from '../components/common/FadeIn';
import useSeo from '../lib/useSeo';
import styles from './ShareYourExperience.module.css';

function ShareYourExperience() {
  useSeo({
    title: 'Share Your Experience',
    description:
      'Been on a trip with Green Barbet Adventures? Tell us how it went — your review helps future travelers plan their own Kenya trip.',
  });

  return (
    <Section background="cream">
      <Container>
        <div className={styles.wrap}>
          <FadeIn className={styles.intro}>
            <h1>Share Your Experience</h1>
            <p>
              Been on a trip with us? We&rsquo;d love to hear how it went. Reviews are read by our
              team before appearing on the site — no spam, just real trips from real travelers.
            </p>
          </FadeIn>

          <FadeIn className={styles.formCol} delay={0.15}>
            <TestimonialSubmissionForm />
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}

export default ShareYourExperience;

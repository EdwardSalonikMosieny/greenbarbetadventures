import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import FadeIn from '../components/common/FadeIn';
import useSeo from '../lib/useSeo';
import { CONTACT_INFO } from '../data/navigation';
import styles from './LegalPage.module.css';

// Placeholder legal text — real content and applicable law, but not a substitute for
// review by a lawyer before this goes live. See CLAUDE.md's note on avoiding dead
// Privacy Policy / Terms links, one of the old site's specific problems.
function PrivacyPolicy() {
  useSeo({
    title: 'Privacy Policy',
    description: 'How Green Barbet Adventures collects, uses, and protects your personal information.',
  });

  return (
    <Section background="cream">
      <Container>
        <FadeIn className={styles.page}>
          <h1>Privacy Policy</h1>
          <p className={styles.updated}>Last updated: January 2026</p>

          <p>
            Green Barbet Adventures Ltd (“Green Barbet Adventures,” “we,” “us”) respects your
            privacy. This policy explains what information we collect when you use this website
            or enquire about a tour, how we use it, and the choices available to you.
          </p>

          <h2>Information We Collect</h2>
          <p>When you submit a booking inquiry or subscribe to our newsletter, we collect:</p>
          <ul>
            <li>Your name, email address, and phone number</li>
            <li>Travel details you provide — preferred dates, number of travelers, and tour interest</li>
            <li>Any additional information you include in your message to us</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information you provide to:</p>
          <ul>
            <li>Respond to booking inquiries and plan your itinerary</li>
            <li>Send confirmations, updates, and — if you subscribe — occasional newsletters</li>
            <li>Improve our tours and services</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>

          <h2>Data Retention & Security</h2>
          <p>
            We retain booking and inquiry information for as long as needed to provide our
            services and meet legal obligations, and take reasonable technical measures to
            protect it against unauthorized access.
          </p>

          <h2>Your Rights</h2>
          <p>
            Under Kenya's Data Protection Act, 2019, you have the right to access, correct, or
            request deletion of your personal data held by us, and to withdraw newsletter
            consent at any time via the unsubscribe link in any email we send.
          </p>

          <h2>Contact Us</h2>
          <p>
            Questions about this policy or your data can be sent to{' '}
            <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a> or by calling{' '}
            {CONTACT_INFO.phones[0]}.
          </p>
        </FadeIn>
      </Container>
    </Section>
  );
}

export default PrivacyPolicy;

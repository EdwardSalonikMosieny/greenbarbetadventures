import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import FadeIn from '../components/common/FadeIn';
import useSeo from '../lib/useSeo';
import { CONTACT_INFO } from '../data/navigation';
import styles from './LegalPage.module.css';

// Placeholder legal text — real content grounded in standard Kenyan tour-operator
// practice, but not a substitute for review by a lawyer before this goes live.
function Terms() {
  useSeo({
    title: 'Terms & Conditions',
    description: 'Booking, payment, and travel terms for tours arranged through Green Barbet Adventures.',
  });

  return (
    <Section background="cream">
      <Container>
        <FadeIn className={styles.page}>
          <h1>Terms & Conditions</h1>
          <p className={styles.updated}>Last updated: January 2026</p>

          <p>
            These terms govern bookings and tours arranged through Green Barbet Adventures Ltd
            (“Green Barbet Adventures,” “we,” “us”), based near Naromoru River Lodge, Naromoru,
            Kenya. By submitting a booking inquiry or joining a tour, you agree to the terms
            below.
          </p>

          <h2>Bookings & Inquiries</h2>
          <p>
            Submitting a booking inquiry through this website does not guarantee a confirmed
            reservation. A booking is confirmed once we have reviewed availability with you
            directly and agreed on final details, pricing, and payment.
          </p>

          <h2>Payment</h2>
          <p>
            Pricing and payment terms are confirmed directly with our team once your itinerary is
            finalized, and are not published on this site. We accept Visa, Mastercard, and
            PayPal.
          </p>

          <h2>Cancellations & Changes</h2>
          <p>
            Cancellation terms depend on the specific tour and how close to departure a change is
            requested — these will be confirmed with you in writing when your booking is
            finalized. Please contact us as early as possible if your plans change.
          </p>

          <h2>Travel & Safety</h2>
          <p>
            Wildlife safaris and mountain treks carry inherent risks. Guests should follow guide
            instructions at all times, disclose relevant medical conditions before travel, and
            hold appropriate travel insurance. Green Barbet Adventures is not liable for delays,
            weather, wildlife behavior, or circumstances outside our reasonable control.
          </p>

          <h2>Conduct</h2>
          <p>
            We ask all guests to respect local communities, wildlife, and conservation area
            regulations throughout their trip.
          </p>

          <h2>Contact Us</h2>
          <p>
            Questions about these terms can be sent to{' '}
            <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a> or by calling{' '}
            {CONTACT_INFO.phones[0]}.
          </p>
        </FadeIn>
      </Container>
    </Section>
  );
}

export default Terms;

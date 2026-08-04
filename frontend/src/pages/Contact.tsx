import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import BookingInquiryForm from '../components/contact/BookingInquiryForm';
import FadeIn from '../components/common/FadeIn';
import useSeo from '../lib/useSeo';
import { CONTACT_INFO } from '../data/navigation';
import styles from './Contact.module.css';

function Contact() {
  useSeo({
    title: 'Contact & Booking',
    description:
      'Plan your Kenya trip with Green Barbet Adventures — send a booking inquiry or reach our team in Naromoru directly by phone or email.',
  });

  return (
    <Section background="cream">
      <Container>
        <div className={styles.layout}>
          <FadeIn className={styles.intro}>
            <h1>Plan Your Trip</h1>
            <p>
              Tell us what you have in mind and we’ll get back to you within 24 hours with real
              availability and next steps — no automated quote, a real reply from our team in
              Naromoru.
            </p>

            <dl className={styles.details}>
              <div>
                <dt>Phone</dt>
                <dd>
                  {CONTACT_INFO.phones.map((phone) => (
                    <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`}>
                      {phone}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>Near Naromoru River Lodge, Naromoru, Kenya</dd>
              </div>
            </dl>
          </FadeIn>

          <FadeIn className={styles.formCol} delay={0.15}>
            <BookingInquiryForm />
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}

export default Contact;

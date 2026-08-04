import { Link } from 'react-router-dom';
import Container from './Container';
import Logo from '../navigation/Logo';
import PaymentBadges from './PaymentBadges';
import SocialIcon from './SocialIcon';
import { CONTACT_INFO, LEGAL_LINKS, SECONDARY_LINKS, SOCIAL_LINKS, TOUR_CATEGORIES } from '../../data/navigation';
import styles from './Footer.module.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Logo light />
            <p className={styles.tagline}>Dream, Explore, Discover</p>
            <p className={styles.blurb}>
              Kenya-based tours and travel, run from Naromoru — real itineraries across the
              country's wildlife, culture, coast, and mountains.
            </p>
            <div className={styles.social}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={styles.socialLink}
                >
                  <SocialIcon platform={social.label} />
                </a>
              ))}
            </div>
          </div>

          <nav className={styles.col} aria-label="Footer quick links">
            <h3>Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            {SECONDARY_LINKS.map((link) => (
              <Link key={link.href} to={link.href}>
                {link.label}
              </Link>
            ))}
            <Link to="/share-your-experience">Share Your Experience</Link>
          </nav>

          <nav className={styles.col} aria-label="Footer tour categories">
            <h3>Tours</h3>
            {TOUR_CATEGORIES.map((category) => (
              <Link key={category.slug} to={`/tours/${category.slug}`}>
                {category.label}
              </Link>
            ))}
          </nav>

          <div className={styles.col}>
            <h3>Contact</h3>
            {CONTACT_INFO.phones.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`}>
                {phone}
              </a>
            ))}
            <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
            <p className={styles.address}>{CONTACT_INFO.address}</p>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {year} Green Barbet Adventures Ltd. All rights reserved.
          </p>

          <nav className={styles.legalLinks} aria-label="Legal">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} to={link.href}>
                {link.label}
              </Link>
            ))}
            <Link to="/admin/login" className={styles.adminLink}>
              Admin Login
            </Link>
          </nav>

          <PaymentBadges />
        </div>
      </Container>
    </footer>
  );
}

export default Footer;

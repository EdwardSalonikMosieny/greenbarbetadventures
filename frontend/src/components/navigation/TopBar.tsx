import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import { CONTACT_INFO } from '../../data/navigation';
import styles from './TopBar.module.css';

// Desktop-only quick-contact strip above the main nav. Also carries the admin login
// entry point, de-emphasized via smaller size (not color/opacity, which failed WCAG AA
// contrast) per CLAUDE.md ("not prominent in the main nav").
function TopBar() {
  const [primaryPhone] = CONTACT_INFO.phones;

  return (
    <div className={styles.bar}>
      <Container>
        <div className={styles.row}>
          <div className={styles.contacts}>
            <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`}>{primaryPhone}</a>
            <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
          </div>
          <Link to="/admin/login" className={styles.admin} aria-label="Admin Login" title="Admin Login">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default TopBar;

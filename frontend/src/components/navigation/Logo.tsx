import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

interface LogoProps {
  /** True on dark backgrounds (currently just the footer) — the real logo's dark
   *  wordmark text isn't legible there, so a light-colored text wordmark is used instead. */
  light?: boolean;
}

function Logo({ light = false }: LogoProps) {
  if (light) {
    return (
      <Link
        to="/"
        className={`${styles.logo} ${styles.light}`}
        aria-label="Green Barbet Adventures — home"
      >
        Green Barbet <span className={styles.accent}>Adventures</span>
      </Link>
    );
  }

  return (
    <Link to="/" className={styles.logoImageLink} aria-label="Green Barbet Adventures — home">
      <img
        src="/images/gba-logo.png"
        alt="Green Barbet Adventures"
        width={178}
        height={60}
        className={styles.logoImage}
      />
    </Link>
  );
}

export default Logo;

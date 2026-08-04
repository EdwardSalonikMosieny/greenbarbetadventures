import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import {
  CONTACT_INFO,
  PRIMARY_LINKS,
  SECONDARY_LINKS,
  TOUR_CATEGORIES,
} from '../../data/navigation';
import styles from './MobileDrawer.module.css';

function drawerLinkClassName({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

// Slide-in panel from the right. Traps focus while open, restores it to the
// hamburger trigger on close, and locks background scroll — standard modal-drawer behavior.
function MobileDrawer({ open, onClose, triggerRef }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the panel so keyboard/screen-reader users land inside it.
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>('a, button');
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className={styles.panel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button type="button" className={styles.close} onClick={onClose}>
              Close <span aria-hidden="true">✕</span>
            </button>

            <nav className={styles.nav}>
              <ul>
                {PRIMARY_LINKS.map((link) => (
                  <li key={link.href}>
                    <NavLink to={link.href} end={link.href === '/'} onClick={onClose} className={drawerLinkClassName}>
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <p className={styles.groupLabel}>Tours</p>
              <ul>
                {TOUR_CATEGORIES.map((category) => (
                  <li key={category.slug}>
                    <NavLink
                      to={`/tours/${category.slug}`}
                      onClick={onClose}
                      className={drawerLinkClassName}
                    >
                      {category.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <ul>
                {SECONDARY_LINKS.map((link) => (
                  <li key={link.href}>
                    <NavLink to={link.href} onClick={onClose} className={drawerLinkClassName}>
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <Link to="/contact" className={styles.cta} onClick={onClose}>
              Book Now
            </Link>

            <div className={styles.footer}>
              <a href={`tel:${CONTACT_INFO.phones[0].replace(/\s+/g, '')}`}>
                {CONTACT_INFO.phones[0]}
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
              <Link
                to="/admin/login"
                className={styles.admin}
                onClick={onClose}
                aria-label="Admin Login"
                title="Admin Login"
              >
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileDrawer;

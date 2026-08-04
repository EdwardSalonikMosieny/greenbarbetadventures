import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Container from '../layout/Container';
import Logo from './Logo';
import ToursDropdown from './ToursDropdown';
import TopBar from './TopBar';
import MobileDrawer from './MobileDrawer';
import { SECONDARY_LINKS } from '../../data/navigation';
import styles from './Navbar.module.css';

const SCROLL_THRESHOLD = 10;

// Growing underline on hover, persistent underline on the active route — handled via
// CSS on .navLink/.navLinkActive rather than NavLink's own (undocumented-by-default)
// active class, so behavior is explicit here.
function navLinkClassName({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Nav is fixed (removed from flow), so every route's <main> needs padding-top
  // equal to its real rendered height — measured rather than hardcoded since
  // TopBar only exists ≥1024px, changing the total height at that breakpoint.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    function updateHeight() {
      document.documentElement.style.setProperty('--fixed-nav-height', `${el!.offsetHeight}px`);
    }

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={styles.fixedWrapper}>
      <TopBar />
      <header
        className={[styles.header, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}
      >
        <Container>
          <div className={styles.row}>
            <Logo />

            <nav className={styles.desktopNav} aria-label="Primary">
              <NavLink to="/" end className={navLinkClassName}>
                Home
              </NavLink>
              <NavLink to="/about" className={navLinkClassName}>
                About
              </NavLink>
              <ToursDropdown />
              {SECONDARY_LINKS.map((link) => (
                <NavLink key={link.href} to={link.href} className={navLinkClassName}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className={styles.actions}>
              <Link to="/contact" className={styles.cta}>
                Book Now
              </Link>
              <button
                ref={hamburgerRef}
                type="button"
                className={styles.hamburger}
                aria-label="Open menu"
                aria-expanded={drawerOpen}
                aria-controls="mobile-drawer"
                onClick={() => setDrawerOpen(true)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        triggerRef={hamburgerRef}
      />
    </div>
  );
}

export default Navbar;

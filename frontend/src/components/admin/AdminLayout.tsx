import { Suspense } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useSeo from '../../lib/useSeo';
import ErrorBoundary from '../common/ErrorBoundary';
import RouteLoadingFallback from '../common/RouteLoadingFallback';
import styles from './AdminLayout.module.css';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const } },
};

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Overview', end: true },
  { to: '/admin/dashboard/tours', label: 'Tours' },
  { to: '/admin/dashboard/destinations', label: 'Destinations' },
  { to: '/admin/dashboard/activities', label: 'Activities' },
  { to: '/admin/dashboard/experiences', label: 'Experiences' },
  { to: '/admin/dashboard/inquiries', label: 'Booking Inquiries' },
  { to: '/admin/dashboard/subscribers', label: 'Newsletter Subscribers' },
  { to: '/admin/dashboard/testimonials', label: 'Testimonials' },
];

function AdminLayout() {
  useSeo({ title: 'Admin Dashboard', description: 'Internal management tools.', noindex: true });
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Green Barbet Admin</div>
        <nav className={styles.nav} aria-label="Admin sections">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.footer}>
          <p className={styles.adminName}>{admin?.name}</p>
          <button type="button" className={styles.logout} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>
      <main className={styles.content}>
        <ErrorBoundary>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              variants={reduceMotion ? undefined : pageVariants}
              initial={reduceMotion ? false : 'initial'}
              animate="animate"
              exit={reduceMotion ? undefined : 'exit'}
            >
              <Suspense fallback={<RouteLoadingFallback />}>
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default AdminLayout;

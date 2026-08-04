import { Suspense } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Navbar from '../navigation/Navbar';
import Footer from './Footer';
import ErrorBoundary from '../common/ErrorBoundary';
import RouteLoadingFallback from '../common/RouteLoadingFallback';
import styles from './RootLayout.module.css';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const } },
};

// Single Suspense boundary here covers every lazy-loaded route page rendered through Outlet.
// ScrollRestoration resets scroll to top on new navigations (e.g. a footer link clicked from
// deep down a long Home page) while still restoring position on browser back/forward.
// ErrorBoundary sits inside Navbar/Footer so a crash in one page's render doesn't also
// take down the site chrome — visitors keep the nav and a way back to Home.
// AnimatePresence (keyed on pathname) gives every route change a quick fade/rise instead
// of an instant hard-cut — Suspense sits inside it so each entering page's own lazy chunk
// still shows the spinner fallback while it loads, rather than that being a separate step.
function RootLayout() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Navbar />
      <main className={styles.main}>
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
      <Footer />
      <ScrollRestoration />
    </>
  );
}

export default RootLayout;

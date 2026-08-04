import styles from './RouteLoadingFallback.module.css';

// Suspense fallback for lazy-loaded route chunks. Route chunks are small and usually
// load fast, so this intentionally has no fade-in delay logic — simplicity over a
// "only show after 200ms" trick that isn't worth the complexity at this site's scale.
function RouteLoadingFallback() {
  return (
    <div className={styles.wrap} role="status" aria-label="Loading page">
      <span className={styles.spinner} aria-hidden="true" />
    </div>
  );
}

export default RouteLoadingFallback;

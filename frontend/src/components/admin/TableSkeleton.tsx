import styles from './TableSkeleton.module.css';

interface TableSkeletonProps {
  rows?: number;
}

// Shown while an admin list page's first fetch is in flight — a plain "Loading…" text
// node causes more layout shift than a shape that already approximates the real table.
function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className={styles.wrap} role="status" aria-label="Loading data">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={styles.row} />
      ))}
    </div>
  );
}

export default TableSkeleton;

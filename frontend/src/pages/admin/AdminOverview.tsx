import { useEffect, useState } from 'react';
import { get } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminResource.module.css';

interface Stats {
  totalTours: number;
  publishedTours: number;
  totalDestinations: number;
  totalActivities: number;
  totalExperiences: number;
  totalSubscribers: number;
  totalInquiries: number;
  inquiriesByStatus: { NEW: number; CONTACTED: number; CONFIRMED: number; CLOSED: number };
  totalTestimonials: number;
  pendingTestimonials: number;
}

function AdminOverview() {
  const { admin, token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    get<Stats>('/admin/stats', token)
      .then(setStats)
      .catch(() => setLoadError('Could not load stats.'))
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <div>
      <div className={styles.header}>
        <h1>Overview</h1>
      </div>
      <p>Welcome back, {admin?.name}.</p>

      {isLoading && <p>Loading…</p>}
      {loadError && <p className={styles.errorText}>{loadError}</p>}

      {stats && (
        <div className={styles.statTiles}>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{stats.totalTours}</div>
            <div className={styles.statLabel}>Tours ({stats.publishedTours} published)</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{stats.totalDestinations}</div>
            <div className={styles.statLabel}>Destinations</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{stats.totalActivities}</div>
            <div className={styles.statLabel}>Activities</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{stats.totalExperiences}</div>
            <div className={styles.statLabel}>Stories</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{stats.totalSubscribers}</div>
            <div className={styles.statLabel}>Newsletter Subscribers</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{stats.inquiriesByStatus.NEW}</div>
            <div className={styles.statLabel}>New Inquiries (of {stats.totalInquiries} total)</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{stats.pendingTestimonials}</div>
            <div className={styles.statLabel}>Testimonials Awaiting Review (of {stats.totalTestimonials} total)</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOverview;

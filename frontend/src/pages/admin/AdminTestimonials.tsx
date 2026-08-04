import { useEffect, useState } from 'react';
import { del, get, patch } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import TableSkeleton from '../../components/admin/TableSkeleton';
import styles from './AdminResource.module.css';

interface AdminTestimonial {
  id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  quote: string;
  tour: { title: string; slug: string } | null;
  isApproved: boolean;
  createdAt: string;
}

function AdminTestimonials() {
  const { token } = useAuth();
  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      setItems(await get<AdminTestimonial[]>('/admin/testimonials', token));
    } catch {
      setLoadError('Could not load testimonials.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Standard fetch-on-mount: load() synchronously flips isLoading/loadError before its
    // await, which is exactly what a list page's initial load is supposed to do.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function toggleApproval(item: AdminTestimonial) {
    if (!token) return;
    setUpdatingId(item.id);
    try {
      const updated = await patch<AdminTestimonial>(
        `/admin/testimonials/${item.id}/approval`,
        { isApproved: !item.isApproved },
        token,
      );
      setItems((prev) => prev.map((t) => (t.id === item.id ? updated : t)));
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(item: AdminTestimonial) {
    if (!token) return;
    if (!window.confirm(`Delete the review from "${item.customerName}"? This cannot be undone.`)) return;
    await del(`/admin/testimonials/${item.id}`, token);
    await load();
  }

  const columns: Column<AdminTestimonial>[] = [
    {
      key: 'date',
      label: 'Submitted',
      render: (t) => new Date(t.createdAt).toLocaleDateString(),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (t) => (
        <div>
          <div>{t.customerName}</div>
          <div>{t.customerEmail}</div>
        </div>
      ),
    },
    { key: 'rating', label: 'Rating', render: (t) => '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating) },
    { key: 'tour', label: 'Tour', render: (t) => t.tour?.title ?? 'General experience' },
    {
      key: 'quote',
      label: 'Review',
      render: (t) => (t.quote.length > 80 ? `${t.quote.slice(0, 80)}…` : t.quote),
    },
    {
      key: 'status',
      label: 'Status',
      render: (t) => (t.isApproved ? 'Approved' : 'Pending'),
    },
    {
      key: 'actions',
      label: '',
      render: (t) => (
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => toggleApproval(t)}
            disabled={updatingId === t.id}
            className={styles.editBtn}
          >
            {t.isApproved ? 'Unapprove' : 'Approve'}
          </button>
          <button type="button" onClick={() => handleDelete(t)} className={styles.deleteBtn}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h1>Testimonials</h1>
      </div>

      {isLoading && <TableSkeleton />}
      {loadError && <p className={styles.errorText}>{loadError}</p>}
      {!isLoading && !loadError && (
        <DataTable
          columns={columns}
          rows={items}
          keyExtractor={(t) => t.id}
          emptyMessage="No testimonials yet."
        />
      )}
    </div>
  );
}

export default AdminTestimonials;

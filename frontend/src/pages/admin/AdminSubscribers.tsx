import { useEffect, useState } from 'react';
import { del, get } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import TableSkeleton from '../../components/admin/TableSkeleton';
import styles from './AdminResource.module.css';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

function AdminSubscribers() {
  const { token } = useAuth();
  const [items, setItems] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      setItems(await get<Subscriber[]>('/admin/newsletter-subscribers', token));
    } catch {
      setLoadError('Could not load subscribers.');
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

  async function handleRemove(item: Subscriber) {
    if (!token) return;
    if (!window.confirm(`Remove "${item.email}" from the newsletter list?`)) return;
    await del(`/admin/newsletter-subscribers/${item.id}`, token);
    await load();
  }

  const columns: Column<Subscriber>[] = [
    { key: 'email', label: 'Email', render: (s) => s.email },
    { key: 'date', label: 'Subscribed', render: (s) => new Date(s.subscribedAt).toLocaleDateString() },
    {
      key: 'actions',
      label: '',
      render: (s) => (
        <div className={styles.actions}>
          <button type="button" onClick={() => handleRemove(s)} className={styles.deleteBtn}>
            Remove
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h1>Newsletter Subscribers</h1>
      </div>

      {isLoading && <TableSkeleton />}
      {loadError && <p className={styles.errorText}>{loadError}</p>}
      {!isLoading && !loadError && (
        <DataTable columns={columns} rows={items} keyExtractor={(s) => s.id} emptyMessage="No subscribers yet." />
      )}
    </div>
  );
}

export default AdminSubscribers;

import { useEffect, useState } from 'react';
import { get, patch } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import TableSkeleton from '../../components/admin/TableSkeleton';
import styles from './AdminResource.module.css';

type InquiryStatus = 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'CLOSED';

interface BookingInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  tour: { title: string; slug: string } | null;
  preferredDates: string;
  numberOfTravelers: number;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

const STATUSES: InquiryStatus[] = ['NEW', 'CONTACTED', 'CONFIRMED', 'CLOSED'];

function AdminInquiries() {
  const { token } = useAuth();
  const [items, setItems] = useState<BookingInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      setItems(await get<BookingInquiry[]>('/admin/booking-inquiries', token));
    } catch {
      setLoadError('Could not load booking inquiries.');
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

  async function handleStatusChange(id: string, status: InquiryStatus) {
    if (!token) return;
    setUpdatingId(id);
    try {
      const updated = await patch<BookingInquiry>(`/admin/booking-inquiries/${id}/status`, { status }, token);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } finally {
      setUpdatingId(null);
    }
  }

  const columns: Column<BookingInquiry>[] = [
    {
      key: 'date',
      label: 'Received',
      render: (i) => new Date(i.createdAt).toLocaleDateString(),
    },
    { key: 'name', label: 'Name', render: (i) => i.name },
    {
      key: 'contact',
      label: 'Contact',
      render: (i) => (
        <div>
          <div>{i.email}</div>
          <div>{i.phone}</div>
        </div>
      ),
    },
    { key: 'tour', label: 'Tour', render: (i) => i.tour?.title ?? 'General inquiry' },
    { key: 'dates', label: 'Preferred Dates', render: (i) => i.preferredDates },
    { key: 'travelers', label: 'Travelers', render: (i) => i.numberOfTravelers },
    {
      key: 'message',
      label: 'Message',
      render: (i) => (i.message.length > 60 ? `${i.message.slice(0, 60)}…` : i.message),
    },
    {
      key: 'status',
      label: 'Status',
      render: (i) => (
        <select
          value={i.status}
          disabled={updatingId === i.id}
          onChange={(e) => handleStatusChange(i.id, e.target.value as InquiryStatus)}
          className={styles.statusSelect}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h1>Booking Inquiries</h1>
      </div>

      {isLoading && <TableSkeleton />}
      {loadError && <p className={styles.errorText}>{loadError}</p>}
      {!isLoading && !loadError && (
        <DataTable
          columns={columns}
          rows={items}
          keyExtractor={(i) => i.id}
          emptyMessage="No booking inquiries yet."
        />
      )}
    </div>
  );
}

export default AdminInquiries;

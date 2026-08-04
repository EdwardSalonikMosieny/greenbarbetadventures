import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { del, get, post, put, resolveImageUrl } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ImageUploadField from '../../components/admin/ImageUploadField';
import TableSkeleton from '../../components/admin/TableSkeleton';
import styles from './AdminResource.module.css';

interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const activitySchema = z.object({
  title: z.string().trim().min(2, 'Enter a title'),
  description: z.string().trim().min(10, 'Enter a longer description'),
  imageUrl: z.string().trim().min(1, 'Upload an image'),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

const EMPTY: ActivityFormValues = { title: '', description: '', imageUrl: '' };

function AdminActivities() {
  const { token } = useAuth();
  const [items, setItems] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormValues>({ resolver: zodResolver(activitySchema), defaultValues: EMPTY });

  async function load() {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      setItems(await get<Activity[]>('/admin/activities', token));
    } catch {
      setLoadError('Could not load activities.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function openCreate() {
    setEditing(null);
    reset(EMPTY);
    setSubmitError(null);
    setModalOpen(true);
  }

  function openEdit(item: Activity) {
    setEditing(item);
    reset({ title: item.title, description: item.description, imageUrl: item.imageUrl });
    setSubmitError(null);
    setModalOpen(true);
  }

  async function onSubmit(values: ActivityFormValues) {
    if (!token) return;
    setSubmitError(null);
    try {
      if (editing) {
        await put(`/admin/activities/${editing.id}`, values, token);
      } else {
        await post('/admin/activities', values, token);
      }
      setModalOpen(false);
      await load();
    } catch {
      setSubmitError('Save failed. Please check the form and try again.');
    }
  }

  async function handleDelete(item: Activity) {
    if (!token) return;
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    await del(`/admin/activities/${item.id}`, token);
    await load();
  }

  const columns: Column<Activity>[] = [
    {
      key: 'image',
      label: '',
      render: (a) => <img src={resolveImageUrl(a.imageUrl)} alt="" className={styles.thumb} />,
    },
    { key: 'title', label: 'Title', render: (a) => a.title },
    {
      key: 'description',
      label: 'Description',
      render: (a) => (a.description.length > 80 ? `${a.description.slice(0, 80)}…` : a.description),
    },
    {
      key: 'actions',
      label: '',
      render: (a) => (
        <div className={styles.actions}>
          <button type="button" onClick={() => openEdit(a)} className={styles.editBtn}>
            Edit
          </button>
          <button type="button" onClick={() => handleDelete(a)} className={styles.deleteBtn}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h1>Activities</h1>
        <button type="button" className={styles.newBtn} onClick={openCreate}>
          New Activity
        </button>
      </div>

      {isLoading && <TableSkeleton />}
      {loadError && <p className={styles.errorText}>{loadError}</p>}
      {!isLoading && !loadError && (
        <DataTable columns={columns} rows={items} keyExtractor={(a) => a.id} emptyMessage="No activities yet." />
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Activity' : 'New Activity'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor="activity-title">Title</label>
              <input id="activity-title" {...register('title')} className={styles.input} />
              {errors.title && <p className={styles.errorText}>{errors.title.message}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="activity-description">Description</label>
              <textarea
                id="activity-description"
                rows={4}
                {...register('description')}
                className={styles.textarea}
              />
              {errors.description && <p className={styles.errorText}>{errors.description.message}</p>}
            </div>
            <ImageUploadField
              label="Image"
              value={watch('imageUrl')}
              onChange={(url) => setValue('imageUrl', url, { shouldValidate: true })}
              error={errors.imageUrl?.message}
            />
            {submitError && <p className={styles.errorText}>{submitError}</p>}
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default AdminActivities;

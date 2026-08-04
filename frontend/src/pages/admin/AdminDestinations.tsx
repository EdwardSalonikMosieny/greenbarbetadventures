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

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImageUrl: string;
  region: string;
}

const destinationSchema = z.object({
  name: z.string().trim().min(2, 'Enter a name'),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase-with-hyphens only'),
  description: z.string().trim().min(10, 'Enter a longer description'),
  heroImageUrl: z.string().trim().min(1, 'Upload a hero image'),
  region: z.string().trim().min(2, 'Enter a region'),
});

type DestinationFormValues = z.infer<typeof destinationSchema>;

const EMPTY: DestinationFormValues = { name: '', slug: '', description: '', heroImageUrl: '', region: '' };

function AdminDestinations() {
  const { token } = useAuth();
  const [items, setItems] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DestinationFormValues>({ resolver: zodResolver(destinationSchema), defaultValues: EMPTY });

  async function load() {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      setItems(await get<Destination[]>('/admin/destinations', token));
    } catch {
      setLoadError('Could not load destinations.');
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

  function openEdit(item: Destination) {
    setEditing(item);
    reset({
      name: item.name,
      slug: item.slug,
      description: item.description,
      heroImageUrl: item.heroImageUrl,
      region: item.region,
    });
    setSubmitError(null);
    setModalOpen(true);
  }

  async function onSubmit(values: DestinationFormValues) {
    if (!token) return;
    setSubmitError(null);
    try {
      if (editing) {
        await put(`/admin/destinations/${editing.id}`, values, token);
      } else {
        await post('/admin/destinations', values, token);
      }
      setModalOpen(false);
      await load();
    } catch {
      setSubmitError('Save failed. Please check the form and try again.');
    }
  }

  async function handleDelete(item: Destination) {
    if (!token) return;
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    await del(`/admin/destinations/${item.id}`, token);
    await load();
  }

  const columns: Column<Destination>[] = [
    {
      key: 'image',
      label: '',
      render: (d) => <img src={resolveImageUrl(d.heroImageUrl)} alt="" className={styles.thumb} />,
    },
    { key: 'name', label: 'Name', render: (d) => d.name },
    { key: 'region', label: 'Region', render: (d) => d.region },
    { key: 'slug', label: 'Slug', render: (d) => d.slug },
    {
      key: 'actions',
      label: '',
      render: (d) => (
        <div className={styles.actions}>
          <button type="button" onClick={() => openEdit(d)} className={styles.editBtn}>
            Edit
          </button>
          <button type="button" onClick={() => handleDelete(d)} className={styles.deleteBtn}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h1>Destinations</h1>
        <button type="button" className={styles.newBtn} onClick={openCreate}>
          New Destination
        </button>
      </div>

      {isLoading && <TableSkeleton />}
      {loadError && <p className={styles.errorText}>{loadError}</p>}
      {!isLoading && !loadError && (
        <DataTable
          columns={columns}
          rows={items}
          keyExtractor={(d) => d.id}
          emptyMessage="No destinations yet."
        />
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Destination' : 'New Destination'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor="dest-name">Name</label>
              <input id="dest-name" {...register('name')} className={styles.input} />
              {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="dest-slug">Slug</label>
              <input id="dest-slug" {...register('slug')} className={styles.input} />
              {errors.slug && <p className={styles.errorText}>{errors.slug.message}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="dest-region">Region</label>
              <input id="dest-region" {...register('region')} className={styles.input} />
              {errors.region && <p className={styles.errorText}>{errors.region.message}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="dest-description">Description</label>
              <textarea id="dest-description" rows={4} {...register('description')} className={styles.textarea} />
              {errors.description && <p className={styles.errorText}>{errors.description.message}</p>}
            </div>
            <ImageUploadField
              label="Hero Image"
              value={watch('heroImageUrl')}
              onChange={(url) => setValue('heroImageUrl', url, { shouldValidate: true })}
              error={errors.heroImageUrl?.message}
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

export default AdminDestinations;

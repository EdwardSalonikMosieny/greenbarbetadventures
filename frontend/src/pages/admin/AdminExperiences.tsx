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

interface Experience {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  body: string;
  publishedAt: string | null;
}

const experienceSchema = z.object({
  title: z.string().trim().min(2, 'Enter a title'),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase-with-hyphens only'),
  coverImageUrl: z.string().trim().min(1, 'Upload a cover image'),
  body: z.string().trim().min(10, 'Enter the story body'),
  isPublished: z.boolean(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

const EMPTY: ExperienceFormValues = {
  title: '',
  slug: '',
  coverImageUrl: '',
  body: '',
  isPublished: false,
};

function AdminExperiences() {
  const { token } = useAuth();
  const [items, setItems] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({ resolver: zodResolver(experienceSchema), defaultValues: EMPTY });

  async function load() {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      setItems(await get<Experience[]>('/admin/experiences', token));
    } catch {
      setLoadError('Could not load stories.');
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

  function openEdit(item: Experience) {
    setEditing(item);
    reset({
      title: item.title,
      slug: item.slug,
      coverImageUrl: item.coverImageUrl,
      body: item.body,
      isPublished: item.publishedAt !== null,
    });
    setSubmitError(null);
    setModalOpen(true);
  }

  async function onSubmit(values: ExperienceFormValues) {
    if (!token) return;
    setSubmitError(null);
    const { isPublished, ...rest } = values;
    const payload = {
      ...rest,
      // Draft (unpublished) stories carry publishedAt: null. Re-publishing an already-once-
      // published story keeps updating "now" — acceptable for this scale of content tool.
      publishedAt: isPublished ? new Date().toISOString() : null,
    };
    try {
      if (editing) {
        await put(`/admin/experiences/${editing.id}`, payload, token);
      } else {
        await post('/admin/experiences', payload, token);
      }
      setModalOpen(false);
      await load();
    } catch {
      setSubmitError('Save failed. Please check the form and try again.');
    }
  }

  async function handleDelete(item: Experience) {
    if (!token) return;
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    await del(`/admin/experiences/${item.id}`, token);
    await load();
  }

  const columns: Column<Experience>[] = [
    {
      key: 'image',
      label: '',
      render: (e) => <img src={resolveImageUrl(e.coverImageUrl)} alt="" className={styles.thumb} />,
    },
    { key: 'title', label: 'Title', render: (e) => e.title },
    {
      key: 'status',
      label: 'Status',
      render: (e) => (e.publishedAt ? 'Published' : 'Draft'),
    },
    {
      key: 'actions',
      label: '',
      render: (e) => (
        <div className={styles.actions}>
          <button type="button" onClick={() => openEdit(e)} className={styles.editBtn}>
            Edit
          </button>
          <button type="button" onClick={() => handleDelete(e)} className={styles.deleteBtn}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h1>Experiences / Stories</h1>
        <button type="button" className={styles.newBtn} onClick={openCreate}>
          New Story
        </button>
      </div>

      {isLoading && <TableSkeleton />}
      {loadError && <p className={styles.errorText}>{loadError}</p>}
      {!isLoading && !loadError && (
        <DataTable columns={columns} rows={items} keyExtractor={(e) => e.id} emptyMessage="No stories yet." />
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Story' : 'New Story'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor="exp-title">Title</label>
              <input id="exp-title" {...register('title')} className={styles.input} />
              {errors.title && <p className={styles.errorText}>{errors.title.message}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="exp-slug">Slug</label>
              <input id="exp-slug" {...register('slug')} className={styles.input} />
              {errors.slug && <p className={styles.errorText}>{errors.slug.message}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="exp-body">Story</label>
              <textarea id="exp-body" rows={6} {...register('body')} className={styles.textarea} />
              {errors.body && <p className={styles.errorText}>{errors.body.message}</p>}
            </div>
            <ImageUploadField
              label="Cover Image"
              value={watch('coverImageUrl')}
              onChange={(url) => setValue('coverImageUrl', url, { shouldValidate: true })}
              error={errors.coverImageUrl?.message}
            />
            <div className={styles.checkboxRow}>
              <input id="exp-published" type="checkbox" {...register('isPublished')} />
              <label htmlFor="exp-published">Published (unchecked = draft)</label>
            </div>
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

export default AdminExperiences;

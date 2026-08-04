import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { del, get, post, put, resolveImageUrl } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ImageUploadField from '../../components/admin/ImageUploadField';
import MultiImageUploadField from '../../components/admin/MultiImageUploadField';
import TableSkeleton from '../../components/admin/TableSkeleton';
import styles from './AdminResource.module.css';

interface Destination {
  id: string;
  name: string;
}

interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  itinerary: { day: number; summary: string }[];
  durationDays: number;
  durationNights: number;
  priceUsd: string;
  discountPriceUsd: string | null;
  tourType: 'WILDLIFE_SAFARI' | 'CULTURAL' | 'LUXURY' | 'MOUNTAIN_CLIMBING' | 'CAMPING' | 'BIRDING';
  destinationId: string;
  destination: Destination;
  coverImageUrl: string;
  galleryImages: { id: string; imageUrl: string }[];
  isFeatured: boolean;
  isPublished: boolean;
}

const TOUR_TYPES = [
  { value: 'WILDLIFE_SAFARI', label: 'Wildlife Safari' },
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'LUXURY', label: 'Luxury' },
  { value: 'MOUNTAIN_CLIMBING', label: 'Mountain Climbing' },
  { value: 'CAMPING', label: 'Camping' },
  { value: 'BIRDING', label: 'Birding' },
] as const;

const tourSchema = z.object({
  title: z.string().trim().min(2, 'Enter a title'),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase-with-hyphens only'),
  description: z.string().trim().min(10, 'Enter a longer description'),
  itinerary: z
    .array(z.object({ day: z.coerce.number().int().min(1), summary: z.string().trim().min(1, 'Required') }))
    .min(1, 'Add at least one day'),
  durationDays: z.coerce.number().int().min(1),
  durationNights: z.coerce.number().int().min(0),
  priceUsd: z.coerce.number().positive('Enter a price'),
  hasDiscount: z.boolean(),
  discountPriceUsd: z.coerce.number().positive().nullable(),
  tourType: z.enum(['WILDLIFE_SAFARI', 'CULTURAL', 'LUXURY', 'MOUNTAIN_CLIMBING', 'CAMPING', 'BIRDING']),
  destinationId: z.string().trim().min(1, 'Select a destination'),
  coverImageUrl: z.string().trim().min(1, 'Upload a cover image'),
  galleryImageUrls: z.array(z.string()),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
});

// react-hook-form's form state holds the raw (pre-coercion) input shape for every
// z.coerce field; Zod only produces real numbers in the *output*. See the identical
// pattern (and the reasoning behind it) in BookingInquiryForm.tsx.
type TourFormInput = z.input<typeof tourSchema>;
type TourFormValues = z.output<typeof tourSchema>;

const EMPTY: TourFormInput = {
  title: '',
  slug: '',
  description: '',
  itinerary: [{ day: 1, summary: '' }],
  durationDays: 1,
  durationNights: 0,
  priceUsd: 0,
  hasDiscount: false,
  discountPriceUsd: null,
  tourType: 'WILDLIFE_SAFARI',
  destinationId: '',
  coverImageUrl: '',
  galleryImageUrls: [],
  isFeatured: false,
  isPublished: false,
};

function AdminTours() {
  const { token } = useAuth();
  const [items, setItems] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TourFormInput, unknown, TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: EMPTY,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'itinerary' });
  const hasDiscount = watch('hasDiscount');

  async function load() {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const [tours, dests] = await Promise.all([
        get<Tour[]>('/admin/tours', token),
        get<Destination[]>('/admin/destinations', token),
      ]);
      setItems(tours);
      setDestinations(dests);
    } catch {
      setLoadError('Could not load tours.');
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

  function openEdit(item: Tour) {
    setEditing(item);
    reset({
      title: item.title,
      slug: item.slug,
      description: item.description,
      itinerary: item.itinerary,
      durationDays: item.durationDays,
      durationNights: item.durationNights,
      priceUsd: Number(item.priceUsd),
      hasDiscount: item.discountPriceUsd !== null,
      discountPriceUsd: item.discountPriceUsd !== null ? Number(item.discountPriceUsd) : null,
      tourType: item.tourType,
      destinationId: item.destinationId,
      coverImageUrl: item.coverImageUrl,
      galleryImageUrls: item.galleryImages.map((g) => g.imageUrl),
      isFeatured: item.isFeatured,
      isPublished: item.isPublished,
    });
    setSubmitError(null);
    setModalOpen(true);
  }

  async function onSubmit(values: TourFormValues) {
    if (!token) return;
    setSubmitError(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- hasDiscount is UI-only, stripped from the payload
    const { hasDiscount: _hasDiscount, ...rest } = values;
    const payload = { ...rest, discountPriceUsd: values.hasDiscount ? values.discountPriceUsd : null };
    try {
      if (editing) {
        await put(`/admin/tours/${editing.id}`, payload, token);
      } else {
        await post('/admin/tours', payload, token);
      }
      setModalOpen(false);
      await load();
    } catch {
      setSubmitError('Save failed. Please check the form and try again.');
    }
  }

  async function handleDelete(item: Tour) {
    if (!token) return;
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    await del(`/admin/tours/${item.id}`, token);
    await load();
  }

  const columns: Column<Tour>[] = [
    {
      key: 'image',
      label: '',
      render: (t) => <img src={resolveImageUrl(t.coverImageUrl)} alt="" className={styles.thumb} />,
    },
    { key: 'title', label: 'Title', render: (t) => t.title },
    { key: 'destination', label: 'Destination', render: (t) => t.destination.name },
    { key: 'type', label: 'Type', render: (t) => TOUR_TYPES.find((tt) => tt.value === t.tourType)?.label },
    {
      key: 'status',
      label: 'Status',
      render: (t) => (t.isPublished ? 'Published' : 'Draft') + (t.isFeatured ? ' · Featured' : ''),
    },
    {
      key: 'actions',
      label: '',
      render: (t) => (
        <div className={styles.actions}>
          <button type="button" onClick={() => openEdit(t)} className={styles.editBtn}>
            Edit
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
        <h1>Tours</h1>
        <button type="button" className={styles.newBtn} onClick={openCreate}>
          New Tour
        </button>
      </div>

      {isLoading && <TableSkeleton />}
      {loadError && <p className={styles.errorText}>{loadError}</p>}
      {!isLoading && !loadError && (
        <DataTable columns={columns} rows={items} keyExtractor={(t) => t.id} emptyMessage="No tours yet." />
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Tour' : 'New Tour'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor="tour-title">Title</label>
              <input id="tour-title" {...register('title')} className={styles.input} />
              {errors.title && <p className={styles.errorText}>{errors.title.message}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="tour-slug">Slug</label>
              <input id="tour-slug" {...register('slug')} className={styles.input} />
              {errors.slug && <p className={styles.errorText}>{errors.slug.message}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="tour-description">Description</label>
              <textarea id="tour-description" rows={3} {...register('description')} className={styles.textarea} />
              {errors.description && <p className={styles.errorText}>{errors.description.message}</p>}
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="tour-destination">Destination</label>
                <select id="tour-destination" {...register('destinationId')} className={styles.select}>
                  <option value="">Select a destination…</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.destinationId && <p className={styles.errorText}>{errors.destinationId.message}</p>}
              </div>
              <div className={styles.field}>
                <label htmlFor="tour-type">Tour Type</label>
                <select id="tour-type" {...register('tourType')} className={styles.select}>
                  {TOUR_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="tour-days">Duration (days)</label>
                <input id="tour-days" type="number" min={1} {...register('durationDays')} className={styles.input} />
              </div>
              <div className={styles.field}>
                <label htmlFor="tour-nights">Duration (nights)</label>
                <input
                  id="tour-nights"
                  type="number"
                  min={0}
                  {...register('durationNights')}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="tour-price">Price (USD, internal — never shown publicly)</label>
                <input
                  id="tour-price"
                  type="number"
                  min={0}
                  step="0.01"
                  {...register('priceUsd')}
                  className={styles.input}
                />
                {errors.priceUsd && <p className={styles.errorText}>{errors.priceUsd.message}</p>}
              </div>
              <div className={styles.field}>
                <div className={styles.checkboxRow}>
                  <input id="tour-has-discount" type="checkbox" {...register('hasDiscount')} />
                  <label htmlFor="tour-has-discount">Discount price</label>
                </div>
                {hasDiscount && (
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    aria-label="Discount price USD"
                    {...register('discountPriceUsd')}
                    className={styles.input}
                  />
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label>Itinerary</label>
              {fields.map((field, index) => (
                <div key={field.id} className={styles.itineraryRow}>
                  <input
                    type="number"
                    min={1}
                    aria-label={`Day ${index + 1} number`}
                    {...register(`itinerary.${index}.day`)}
                    className={`${styles.input} ${styles.dayNumberInput}`}
                  />
                  <div className={styles.daySummaryFields}>
                    <input
                      aria-label={`Day ${index + 1} summary`}
                      placeholder="What happens this day"
                      {...register(`itinerary.${index}.summary`)}
                      className={styles.input}
                    />
                    <button type="button" onClick={() => remove(index)} className={styles.deleteBtn}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {errors.itinerary && <p className={styles.errorText}>{errors.itinerary.message}</p>}
              <button
                type="button"
                onClick={() => append({ day: fields.length + 1, summary: '' })}
                className={`${styles.editBtn} ${styles.addDayBtn}`}
              >
                + Add Day
              </button>
            </div>

            <ImageUploadField
              label="Cover Image"
              value={watch('coverImageUrl')}
              onChange={(url) => setValue('coverImageUrl', url, { shouldValidate: true })}
              error={errors.coverImageUrl?.message}
            />
            <MultiImageUploadField
              label="Gallery Images"
              values={watch('galleryImageUrls')}
              onChange={(urls) => setValue('galleryImageUrls', urls)}
            />

            <div className={styles.checkboxRow}>
              <input id="tour-featured" type="checkbox" {...register('isFeatured')} />
              <label htmlFor="tour-featured">Featured</label>
            </div>
            <div className={styles.checkboxRow}>
              <input id="tour-published" type="checkbox" {...register('isPublished')} />
              <label htmlFor="tour-published">Published</label>
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

export default AdminTours;

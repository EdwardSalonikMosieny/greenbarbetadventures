import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { post } from '../../lib/apiClient';
import { TOURS } from '../../data/tours';
import styles from './BookingInquiryForm.module.css';

const bookingInquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
  tourSlug: z.string(),
  preferredDates: z.string().trim().min(2, 'Let us know your preferred dates'),
  numberOfTravelers: z.coerce.number().int().min(1, 'At least 1 traveler'),
  message: z.string().trim().min(10, 'Tell us a little more about your trip'),
});

// react-hook-form's form state holds the raw (pre-coercion) input shape — e.g.
// numberOfTravelers as whatever the <input type="number"> gives it — while Zod's
// z.coerce.number() only produces a real `number` in the *output*. Separating the two
// generics keeps that honest instead of lying to TypeScript about the input type.
type BookingInquiryInput = z.input<typeof bookingInquirySchema>;
type BookingInquiryOutput = z.output<typeof bookingInquirySchema>;

interface BookingInquiryResponse {
  id: string;
  createdAt: string;
}

// tourSlug ties the enquiry to a real static tour (data/tours.ts); the backend resolves
// it to the matching Tour row's id. Empty string means "no specific tour" (General Inquiry).
function BookingInquiryForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingInquiryInput, unknown, BookingInquiryOutput>({
    resolver: zodResolver(bookingInquirySchema),
    defaultValues: { tourSlug: '', numberOfTravelers: 1 },
  });

  async function onSubmit(values: BookingInquiryOutput) {
    setStatus('idle');
    try {
      await post<BookingInquiryResponse>('/booking-inquiries', {
        ...values,
        tourSlug: values.tourSlug || undefined,
      });
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="inquiry-name" className={styles.label}>
            Full name
          </label>
          <input id="inquiry-name" type="text" className={styles.input} {...register('name')} />
          {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="inquiry-email" className={styles.label}>
            Email
          </label>
          <input id="inquiry-email" type="email" className={styles.input} {...register('email')} />
          {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="inquiry-phone" className={styles.label}>
            Phone
          </label>
          <input id="inquiry-phone" type="tel" className={styles.input} {...register('phone')} />
          {errors.phone && <p className={styles.errorText}>{errors.phone.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="inquiry-tour" className={styles.label}>
            Tour of interest
          </label>
          <select id="inquiry-tour" className={styles.input} {...register('tourSlug')}>
            <option value="">General inquiry (no specific tour)</option>
            {TOURS.map((tour) => (
              <option key={tour.slug} value={tour.slug}>
                {tour.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="inquiry-dates" className={styles.label}>
            Preferred travel dates
          </label>
          <input
            id="inquiry-dates"
            type="text"
            placeholder="e.g. Mid-September 2026, flexible"
            className={styles.input}
            {...register('preferredDates')}
          />
          {errors.preferredDates && <p className={styles.errorText}>{errors.preferredDates.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="inquiry-travelers" className={styles.label}>
            Number of travelers
          </label>
          <input
            id="inquiry-travelers"
            type="number"
            min={1}
            className={styles.input}
            {...register('numberOfTravelers')}
          />
          {errors.numberOfTravelers && (
            <p className={styles.errorText}>{errors.numberOfTravelers.message}</p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="inquiry-message" className={styles.label}>
          Tell us about your trip
        </label>
        <textarea
          id="inquiry-message"
          rows={5}
          className={styles.textarea}
          {...register('message')}
        />
        {errors.message && <p className={styles.errorText}>{errors.message.message}</p>}
      </div>

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send Inquiry'}
      </button>

      <div aria-live="polite">
        {status === 'success' && (
          <p className={styles.successText}>
            Thanks — your inquiry is in. We’ll get back to you within 24 hours.
          </p>
        )}
        {status === 'error' && (
          <p className={styles.errorText} role="alert">
            Something went wrong sending your inquiry. Please try again in a moment.
          </p>
        )}
      </div>
    </form>
  );
}

export default BookingInquiryForm;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { post } from '../../lib/apiClient';
import { TOURS } from '../../data/tours';
import styles from './TestimonialSubmissionForm.module.css';

const testimonialSchema = z.object({
  customerName: z.string().trim().min(2, 'Enter your name'),
  customerEmail: z.string().trim().toLowerCase().email('Enter a valid email address'),
  rating: z.number().int().min(1, 'Choose a rating').max(5),
  tourSlug: z.string(),
  quote: z.string().trim().min(10, 'Tell us a bit more about your trip').max(1000),
});

// No z.coerce fields here (unlike BookingInquiryForm/AdminTours), so a single inferred
// type is enough — input and output shapes are identical.
type TestimonialValues = z.infer<typeof testimonialSchema>;

interface TestimonialResponse {
  id: string;
  message: string;
}

const RATING_LABELS = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

// Public submission — every entry lands unapproved (see backend schema) until an
// admin reviews it in the dashboard, so nothing unmoderated reaches the live site.
function TestimonialSubmissionForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { rating: 0, tourSlug: '' },
  });

  const currentRating = watch('rating');

  async function onSubmit(values: TestimonialValues) {
    setStatus('idle');
    try {
      await post<TestimonialResponse>('/testimonials', {
        ...values,
        tourSlug: values.tourSlug || undefined,
      });
      setStatus('success');
      reset({ customerName: '', customerEmail: '', rating: 0, tourSlug: '', quote: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="testimonial-name">Your name</label>
          <input id="testimonial-name" {...register('customerName')} className={styles.input} />
          {errors.customerName && <p className={styles.errorText}>{errors.customerName.message}</p>}
        </div>
        <div className={styles.field}>
          <label htmlFor="testimonial-email">Email</label>
          <input
            id="testimonial-email"
            type="email"
            {...register('customerEmail')}
            className={styles.input}
          />
          <p className={styles.hint}>Never shown publicly — only used if we need to reach you.</p>
          {errors.customerEmail && <p className={styles.errorText}>{errors.customerEmail.message}</p>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="testimonial-tour">Which tour were you on? (optional)</label>
        <select id="testimonial-tour" {...register('tourSlug')} className={styles.input}>
          <option value="">General experience</option>
          {TOURS.map((tour) => (
            <option key={tour.slug} value={tour.slug}>
              {tour.title}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <span id="testimonial-rating-label">Your rating</span>
        <div className={styles.stars} role="radiogroup" aria-labelledby="testimonial-rating-label">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={currentRating === star}
              aria-label={`${star} star${star > 1 ? 's' : ''} — ${RATING_LABELS[star - 1]}`}
              className={star <= currentRating ? `${styles.star} ${styles.starFilled}` : styles.star}
              onClick={() => setValue('rating', star, { shouldValidate: true })}
            >
              ★
            </button>
          ))}
        </div>
        {errors.rating && <p className={styles.errorText}>{errors.rating.message}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="testimonial-quote">Tell us about your trip</label>
        <textarea id="testimonial-quote" rows={5} {...register('quote')} className={styles.textarea} />
        {errors.quote && <p className={styles.errorText}>{errors.quote.message}</p>}
      </div>

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Submit Review'}
      </button>

      <div aria-live="polite">
        {status === 'success' && (
          <p className={styles.successText}>
            Thank you! Your review has been submitted and will appear on the site once we've had a
            look.
          </p>
        )}
        {status === 'error' && (
          <p className={styles.errorText} role="alert">
            Something went wrong submitting your review. Please try again in a moment.
          </p>
        )}
      </div>
    </form>
  );
}

export default TestimonialSubmissionForm;

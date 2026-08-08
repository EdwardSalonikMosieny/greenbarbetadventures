import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { post } from '../../lib/apiClient';
import styles from './NewsletterForm.module.css';

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

interface SubscriberResponse {
  message: string;
}

function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit(values: NewsletterFormValues) {
    setStatus('idle');
    try {
      await post<SubscriberResponse>('/newsletter', values);
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="newsletter-email" className={styles.label}>
          Email address
        </label>
        <div className={styles.inputRow}>
          <input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            className={styles.input}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
            {...register('email')}
          />
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Subscribing…' : 'Subscribe'}
          </button>
        </div>
        {errors.email && (
          <p id="newsletter-email-error" className={styles.errorText} role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div aria-live="polite">
        {status === 'success' && (
          <p className={styles.successText}>You’re subscribed — welcome to the list.</p>
        )}
        {status === 'error' && (
          <p className={styles.errorText} role="alert">
            Something went wrong. Please try again in a moment.
          </p>
        )}
      </div>
    </form>
  );
}

export default NewsletterForm;

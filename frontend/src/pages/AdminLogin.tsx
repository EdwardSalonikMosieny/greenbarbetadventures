import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Location as RouterLocation } from 'react-router-dom';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/apiClient';
import useSeo from '../lib/useSeo';
import styles from './AdminLogin.module.css';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

function AdminLogin() {
  useSeo({ title: 'Admin Login', description: 'Internal access for Green Barbet Adventures staff.', noindex: true });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    try {
      await login(values.email, values.password);
      const from =
        (location.state as { from?: RouterLocation })?.from?.pathname ?? '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setFormError('Invalid email or password.');
      } else if (err instanceof ApiError && err.status === 429) {
        setFormError('Too many attempts. Please wait a few minutes and try again.');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    }
  }

  return (
    <Section background="cream">
      <Container>
        <div className={styles.wrap}>
          <h1>Admin Login</h1>
          <p className={styles.subtext}>Internal access for Green Barbet Adventures staff.</p>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.field}>
              <label htmlFor="login-email" className={styles.label}>
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className={styles.input}
                autoComplete="username"
                {...register('email')}
              />
              {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="login-password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordField}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  autoComplete="current-password"
                  {...register('password')}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="3" y1="21" x2="21" y2="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
            </div>

            {formError && (
              <p className={styles.errorText} role="alert">
                {formError}
              </p>
            )}

            <button type="submit" className={styles.submit} disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </Container>
    </Section>
  );
}

export default AdminLogin;

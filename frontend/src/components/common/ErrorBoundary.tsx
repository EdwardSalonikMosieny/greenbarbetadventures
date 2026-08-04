import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import Container from '../layout/Container';
import Section from '../layout/Section';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error boundaries must be class components — React has no hook equivalent for
// componentDidCatch/getDerivedStateFromError. Without this, any render-time error
// anywhere in the tree would white-screen the entire site instead of showing a
// branded fallback with a way back to safety.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Section background="cream">
          <Container>
            <div className={styles.wrap}>
              <h1>Something went wrong</h1>
              <p>
                We hit an unexpected error loading this page. Please try reloading, or head back
                to the homepage.
              </p>
              <div className={styles.actions}>
                <a href="/" className={styles.homeLink}>
                  Back to Home
                </a>
                <button type="button" className={styles.reloadBtn} onClick={() => window.location.reload()}>
                  Reload Page
                </button>
              </div>
            </div>
          </Container>
        </Section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

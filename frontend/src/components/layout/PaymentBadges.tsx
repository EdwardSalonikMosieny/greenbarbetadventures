import styles from './PaymentBadges.module.css';

const METHODS = ['Visa', 'Mastercard', 'PayPal'] as const;

// Text badges rather than brand logo artwork — communicates accepted payment
// methods without reproducing trademarked wordmarks/icons.
function PaymentBadges() {
  return (
    <div className={styles.row} aria-label="Accepted payment methods">
      {METHODS.map((method) => (
        <span key={method} className={styles.badge}>
          {method}
        </span>
      ))}
    </div>
  );
}

export default PaymentBadges;

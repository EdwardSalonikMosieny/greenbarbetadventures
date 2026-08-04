import { Link } from 'react-router-dom';
import type { Destination } from '../../data/destinations';
import OptimizedImage from '../common/OptimizedImage';
import styles from './DestinationCard.module.css';

interface DestinationCardProps {
  destination: Destination;
}

function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link to={`/destinations/${destination.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <OptimizedImage
          src={destination.heroImageUrl}
          width={destination.heroImageWidth}
          height={destination.heroImageHeight}
          alt={destination.name}
          className={styles.image}
        />
        {destination.tourCount ? (
          <span className={styles.badge}>
            {destination.tourCount} {destination.tourCount === 1 ? 'Tour' : 'Tours'}
          </span>
        ) : null}
      </div>
      <div className={styles.content}>
        <span className={styles.region}>{destination.region}</span>
        <h3 className={styles.name}>{destination.name}</h3>
      </div>
    </Link>
  );
}

export default DestinationCard;

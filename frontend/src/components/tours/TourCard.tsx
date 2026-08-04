import { Link } from 'react-router-dom';
import type { Tour } from '../../data/tours';
import { TOUR_TYPE_TO_CATEGORY_SLUG, getTourDestination } from '../../data/tours';
import OptimizedImage from '../common/OptimizedImage';
import styles from './TourCard.module.css';

interface TourCardProps {
  tour: Tour;
}

function TourCard({ tour }: TourCardProps) {
  const destination = getTourDestination(tour);
  const categorySlug = TOUR_TYPE_TO_CATEGORY_SLUG[tour.tourType];
  const itineraryHref = `/tours/${categorySlug}/${tour.slug}`;
  const image = tour.coverImage ?? {
    src: destination.heroImageUrl,
    width: destination.heroImageWidth,
    height: destination.heroImageHeight,
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <OptimizedImage
          src={image.src}
          width={image.width}
          height={image.height}
          alt={tour.title}
          className={styles.image}
        />
        <span className={styles.duration}>
          {tour.durationDays} Days / {tour.durationNights} Nights
        </span>
      </div>
      <div className={styles.content}>
        <Link to={`/destinations/${destination.slug}`} className={styles.destinationTag}>
          {destination.name}
        </Link>
        <h3 className={styles.title}>{tour.title}</h3>
        <Link to={itineraryHref} className={styles.cta}>
          View Itinerary
        </Link>
      </div>
    </div>
  );
}

export default TourCard;

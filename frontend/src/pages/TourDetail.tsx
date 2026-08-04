import { Link, useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import OptimizedImage from '../components/common/OptimizedImage';
import useSeo from '../lib/useSeo';
import { TOURS, getTourDestination } from '../data/tours';
import styles from './TourDetail.module.css';

// The booking form itself (name/email/dates/travelers) arrives in Step 12 — this
// page is the real itinerary, with a Book Now link into that flow. Prices are
// intentionally not shown publicly per the owner's directive (see CLAUDE.md).
function TourDetail() {
  const { tourSlug } = useParams<{ tourSlug: string }>();
  const tour = TOURS.find((t) => t.slug === tourSlug);

  useSeo({
    title: tour ? tour.title : 'Tour Not Found',
    description: tour
      ? `${tour.description} ${tour.durationDays} days / ${tour.durationNights} nights.`
      : 'This tour could not be found.',
  });

  if (!tour) {
    return (
      <Section background="cream">
        <Container>
          <h1>Tour not found</h1>
          <p>
            <Link to="/tours">Back to all tours</Link>
          </p>
        </Container>
      </Section>
    );
  }

  const destination = getTourDestination(tour);
  const image = tour.coverImage ?? {
    src: destination.heroImageUrl,
    width: destination.heroImageWidth,
    height: destination.heroImageHeight,
  };

  return (
    <Section background="cream">
      <Container>
        <OptimizedImage
          src={image.src}
          width={image.width}
          height={image.height}
          alt={tour.title}
          priority
          className={styles.hero}
        />

        <Link to={`/destinations/${destination.slug}`} className={styles.destinationTag}>
          {destination.name}
        </Link>
        <h1>{tour.title}</h1>

        <div className={styles.metaRow}>
          <span>
            {tour.durationDays} Days / {tour.durationNights} Nights
          </span>
        </div>

        <p className={styles.description}>{tour.description}</p>

        <h2 className={styles.itineraryHeading}>Itinerary</h2>
        <ol className={styles.itinerary}>
          {tour.itinerary.map((day) => (
            <li key={day.day}>
              <strong>Day {day.day}:</strong> {day.summary}
            </li>
          ))}
        </ol>

        {tour.included && tour.included.length > 0 && (
          <>
            <h2 className={styles.itineraryHeading}>Package Includes</h2>
            <ul className={styles.checklist}>
              {tour.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {tour.whatToBring && tour.whatToBring.length > 0 && (
          <>
            <h2 className={styles.itineraryHeading}>What to Bring</h2>
            <ul className={styles.checklist}>
              {tour.whatToBring.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}

        <Link to="/contact" className={styles.cta}>
          Book Now
        </Link>
      </Container>
    </Section>
  );
}

export default TourDetail;

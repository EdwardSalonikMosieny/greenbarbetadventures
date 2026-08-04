import { useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import ToursGrid from '../components/tours/ToursGrid';
import OptimizedImage from '../components/common/OptimizedImage';
import FadeIn from '../components/common/FadeIn';
import useSeo from '../lib/useSeo';
import { TOURS, TOUR_TYPE_TO_CATEGORY_SLUG } from '../data/tours';
import { TOUR_CATEGORIES } from '../data/navigation';
import { TOUR_CATEGORY_CONTENT } from '../data/tourCategoryContent';
import styles from './ToursOverview.module.css';

function ToursCategory() {
  const { category } = useParams<{ category: string }>();
  const match = TOUR_CATEGORIES.find((c) => c.slug === category);
  const tours = TOURS.filter((tour) => TOUR_TYPE_TO_CATEGORY_SLUG[tour.tourType] === category);
  const content = category ? TOUR_CATEGORY_CONTENT[category] : undefined;

  useSeo({
    title: match?.label ?? 'Tours',
    description: `${match?.label ?? 'Kenya tours'} with Green Barbet Adventures — real itineraries across Kenya's parks, reserves, and coastline.`,
  });

  return (
    <Section background="cream">
      <Container>
        <FadeIn className={styles.intro}>
          <h1>{match?.label ?? 'Tours'}</h1>
          <p>{content?.intro ?? 'Real itineraries, from short safaris to week-long circuits.'}</p>
        </FadeIn>

        {content?.photos && content.photos.length > 0 && (
          <div className={styles.categoryPhotos}>
            {content.photos.map((photo) => (
              <figure key={photo.src} className={styles.categoryPhotoItem}>
                <OptimizedImage
                  src={photo.src}
                  width={photo.width}
                  height={photo.height}
                  alt={photo.alt}
                  className={styles.categoryPhotoImage}
                />
              </figure>
            ))}
          </div>
        )}

        {tours.length > 0 ? (
          <ToursGrid tours={tours} />
        ) : (
          <p>No tours in this category yet — check back soon, or browse all tours.</p>
        )}
      </Container>
    </Section>
  );
}

export default ToursCategory;

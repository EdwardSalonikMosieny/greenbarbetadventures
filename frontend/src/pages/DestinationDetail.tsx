import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import OptimizedImage from '../components/common/OptimizedImage';
import Lightbox from '../components/gallery/Lightbox';
import useSeo from '../lib/useSeo';
import { DESTINATIONS } from '../data/destinations';
import styles from './DestinationDetail.module.css';

// Thin wrapper keyed on slug: navigating between two destinations hits the same route
// element (React Router doesn't remount by default), so without this a lightbox left
// open on one destination could carry over and show the wrong photo set on the next.
// Keying on slug forces a full remount instead, resetting activeIndex for free.
function DestinationDetail() {
  const { slug } = useParams<{ slug: string }>();
  return <DestinationDetailPage key={slug} slug={slug} />;
}

function DestinationDetailPage({ slug }: { slug?: string }) {
  const destination = DESTINATIONS.find((d) => d.slug === slug);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useSeo({
    title: destination ? destination.name : 'Destination Not Found',
    description: destination
      ? `${destination.description} Explore ${destination.name} in ${destination.region}, Kenya.`
      : 'This destination could not be found.',
  });

  if (!destination) {
    return (
      <Section background="cream">
        <Container>
          <h1>Destination not found</h1>
          <p>
            <Link to="/destinations">Back to all destinations</Link>
          </p>
        </Container>
      </Section>
    );
  }

  const gallery = destination.gallery ?? [];

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
  }

  return (
    <Section background="cream">
      <Container>
        <OptimizedImage
          src={destination.heroImageUrl}
          width={destination.heroImageWidth}
          height={destination.heroImageHeight}
          alt={destination.name}
          priority
          className={styles.hero}
        />
        <span className={styles.region}>{destination.region}</span>
        <h1>{destination.name}</h1>
        <p className={styles.description}>{destination.description}</p>
        {destination.details.map((paragraph, i) => (
          <p key={i} className={styles.details}>
            {paragraph}
          </p>
        ))}

        {gallery.length > 0 && (
          <div className={styles.galleryWrap}>
            {gallery.length > 1 && (
              <button
                type="button"
                className={`${styles.scrollBtn} ${styles.scrollBtnPrev}`}
                onClick={() => scrollByAmount(-1)}
                aria-label="Scroll photos left"
              >
                ‹
              </button>
            )}

            <div
              ref={scrollRef}
              className={styles.gallery}
              role="group"
              aria-label={`More photos of ${destination.name} — click any photo to view larger`}
            >
              {gallery.map((image, index) => (
                <figure key={image.src} className={styles.galleryItem}>
                  <button
                    type="button"
                    className={styles.galleryButton}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`View larger: ${image.alt}`}
                  >
                    <OptimizedImage
                      src={image.src}
                      width={image.width}
                      height={image.height}
                      alt={image.alt}
                      className={styles.galleryImage}
                    />
                  </button>
                </figure>
              ))}
            </div>

            {gallery.length > 1 && (
              <button
                type="button"
                className={`${styles.scrollBtn} ${styles.scrollBtnNext}`}
                onClick={() => scrollByAmount(1)}
                aria-label="Scroll photos right"
              >
                ›
              </button>
            )}
          </div>
        )}
      </Container>

      {activeIndex !== null && (
        <Lightbox
          images={gallery}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </Section>
  );
}

export default DestinationDetail;

import { useState } from 'react';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import GalleryGrid from '../components/gallery/GalleryGrid';
import Lightbox from '../components/gallery/Lightbox';
import FadeIn from '../components/common/FadeIn';
import useSeo from '../lib/useSeo';
import { GALLERY_IMAGES } from '../data/gallery';
import styles from './Gallery.module.css';

function Gallery() {
  useSeo({
    title: 'Photo Gallery',
    description:
      'Real photos from Green Barbet Adventures trips — wildlife safaris, Mount Kenya treks, and moments from across Kenya.',
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Section background="cream">
      <Container>
        <FadeIn className={styles.intro}>
          <h1>Photo Gallery</h1>
          <p>
            Real moments from Green Barbet Adventures trips — wildlife safaris, Mount Kenya
            treks, and everything in between. Tap any photo for a closer look.
          </p>
        </FadeIn>

        <GalleryGrid images={GALLERY_IMAGES} onSelect={setActiveIndex} />
      </Container>

      {activeIndex !== null && (
        <Lightbox
          images={GALLERY_IMAGES}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </Section>
  );
}

export default Gallery;

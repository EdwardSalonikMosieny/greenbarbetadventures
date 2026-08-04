import { useCallback, useEffect } from 'react';
import styles from './Lightbox.module.css';

// Structural rather than importing GalleryImage — this is reused by any photo set that
// has at least src/alt (the main Gallery page's GALLERY_IMAGES, and destination-specific
// galleries in data/destinations.ts), not just the main gallery.
export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: readonly LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// Full-screen viewer for a gallery grid — arrow keys/buttons step through the whole
// set without closing, so browsing many photos in sequence doesn't mean re-opening
// each one from the grid.
function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const image = images[index];

  const goNext = useCallback(() => {
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, goNext, goPrev]);

  if (!image) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery viewer"
    >
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
        ×
      </button>

      <button
        type="button"
        className={`${styles.nav} ${styles.navPrev}`}
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        aria-label="Previous photo"
      >
        ‹
      </button>

      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <img src={image.src} alt={image.alt} className={styles.image} />
        <p className={styles.caption}>
          {image.alt}
          <span className={styles.count}>
            {index + 1} / {images.length}
          </span>
        </p>
      </div>

      <button
        type="button"
        className={`${styles.nav} ${styles.navNext}`}
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        aria-label="Next photo"
      >
        ›
      </button>
    </div>
  );
}

export default Lightbox;

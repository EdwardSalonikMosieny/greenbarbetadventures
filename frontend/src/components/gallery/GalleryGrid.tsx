import { motion, useReducedMotion } from 'framer-motion';
import type { GalleryImage } from '../../data/gallery';
import OptimizedImage from '../common/OptimizedImage';
import styles from './GalleryGrid.module.css';

interface GalleryGridProps {
  images: readonly GalleryImage[];
  onSelect: (index: number) => void;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
};

// Each tile reveals independently rather than one whileInView on the whole grid —
// with ~70 photos this grid is many viewport-heights tall, so a single parent
// threshold would rarely be satisfiable near the top of the page.
function GalleryGrid({ images, onSelect }: GalleryGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.grid}>
      {images.map((image, index) => (
        <motion.button
          key={image.slug}
          type="button"
          className={styles.tile}
          onClick={() => onSelect(index)}
          aria-label={`View larger: ${image.alt}`}
          variants={item}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className={styles.image}
          />
        </motion.button>
      ))}
    </div>
  );
}

export default GalleryGrid;

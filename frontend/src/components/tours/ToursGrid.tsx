import { motion, useReducedMotion } from 'framer-motion';
import type { Tour } from '../../data/tours';
import TourCard from './TourCard';
import styles from './ToursGrid.module.css';

interface ToursGridProps {
  tours: readonly Tour[];
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

// Each card triggers its own scroll reveal independently — see the
// framer-motion-whileinview-grids memory note from Step 5 for why.
function ToursGrid({ tours }: ToursGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.grid}>
      {tours.map((tour) => (
        <motion.div
          key={tour.slug}
          variants={item}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <TourCard tour={tour} />
        </motion.div>
      ))}
    </div>
  );
}

export default ToursGrid;

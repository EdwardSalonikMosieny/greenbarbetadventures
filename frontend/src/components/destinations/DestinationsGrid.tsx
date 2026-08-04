import { motion, useReducedMotion } from 'framer-motion';
import type { Destination } from '../../data/destinations';
import DestinationCard from './DestinationCard';
import styles from './DestinationsGrid.module.css';

interface DestinationsGridProps {
  destinations: readonly Destination[];
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

// Shared by the Home-page teaser (featured subset) and the full /destinations page.
// Each card triggers its own reveal independently (rather than one whileInView on the
// whole grid) — a grid of many stacked cards can be several viewport-heights tall on
// mobile, and an "amount" threshold measured against that whole tall container would
// rarely be satisfiable near the top of the page.
function DestinationsGrid({ destinations }: DestinationsGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.grid}>
      {destinations.map((destination) => (
        <motion.div
          key={destination.slug}
          variants={item}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <DestinationCard destination={destination} />
        </motion.div>
      ))}
    </div>
  );
}

export default DestinationsGrid;

import { motion, useReducedMotion } from 'framer-motion';
import type { Activity } from '../../data/activities';
import ActivityCard from './ActivityCard';
import styles from './ActivitiesGrid.module.css';

interface ActivitiesGridProps {
  activities: readonly Activity[];
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

// Each card reveals independently — see [[framer_motion_whileinview_grids]] memory:
// a single whileInView on the whole grid rarely fires near the top of a tall page.
function ActivitiesGrid({ activities }: ActivitiesGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.grid}>
      {activities.map((activity) => (
        <motion.div
          key={activity.slug}
          variants={item}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <ActivityCard activity={activity} />
        </motion.div>
      ))}
    </div>
  );
}

export default ActivitiesGrid;

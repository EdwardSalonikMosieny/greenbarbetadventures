import { motion, useReducedMotion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';
import type { Testimonial } from './TestimonialCard';
import styles from './TestimonialsGrid.module.css';

interface TestimonialsGridProps {
  testimonials: readonly Testimonial[];
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

// Each card reveals independently — see [[framer_motion_whileinview_grids]] memory.
function TestimonialsGrid({ testimonials }: TestimonialsGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.grid}>
      {testimonials.map((testimonial) => (
        <motion.div
          key={testimonial.id}
          className={styles.item}
          variants={item}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <TestimonialCard testimonial={testimonial} />
        </motion.div>
      ))}
    </div>
  );
}

export default TestimonialsGrid;

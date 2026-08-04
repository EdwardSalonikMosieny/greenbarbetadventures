import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Container from '../layout/Container';
import Section from '../layout/Section';
import OptimizedImage from '../common/OptimizedImage';
import { SERVICES } from '../../data/services';
import styles from './ServicesSection.module.css';

const row = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

// Alternating image/text rows, one per core service — each row reveals independently
// (see [[framer_motion_whileinview_grids]] memory) rather than one whileInView spanning
// all four, since together they're several viewport-heights tall.
function ServicesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <Section background="cream">
      <Container>
        <div className={styles.header}>
          <h2>What We Offer</h2>
          <p>Four ways to experience Kenya, each built around real itineraries — not templates.</p>
        </div>

        <div className={styles.list}>
          {SERVICES.map((service, index) => (
            <motion.article
              key={service.slug}
              className={[styles.row, index % 2 === 1 ? styles.reversed : ''].join(' ')}
              variants={row}
              initial={reduceMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className={styles.imageWrap}>
                <OptimizedImage
                  src={service.imageUrl}
                  width={service.imageWidth}
                  height={service.imageHeight}
                  alt={service.title}
                  className={styles.image}
                />
              </div>
              <div className={styles.textCol}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link to={`/tours/${service.slug}`} className={styles.link}>
                  Explore {service.title} →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default ServicesSection;

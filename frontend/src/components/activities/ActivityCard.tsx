import type { Activity } from '../../data/activities';
import OptimizedImage from '../common/OptimizedImage';
import styles from './ActivityCard.module.css';

interface ActivityCardProps {
  activity: Activity;
}

function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <OptimizedImage
          src={activity.imageUrl}
          width={activity.imageWidth}
          height={activity.imageHeight}
          alt={activity.title}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{activity.title}</h3>
        <p className={styles.description}>{activity.description}</p>
      </div>
    </article>
  );
}

export default ActivityCard;

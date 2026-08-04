import type { ElementType, ReactNode } from 'react';
import styles from './Container.module.css';

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/** Centers content and caps its width, with responsive horizontal padding. */
function Container({ children, as: Tag = 'div', className }: ContainerProps) {
  const classes = className ? `${styles.container} ${className}` : styles.container;
  return <Tag className={classes}>{children}</Tag>;
}

export default Container;

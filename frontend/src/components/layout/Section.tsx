import type { ElementType, ReactNode } from 'react';
import styles from './Section.module.css';

type SectionBackground = 'cream' | 'forest' | 'transparent';

interface SectionProps {
  children: ReactNode;
  id?: string;
  as?: ElementType;
  className?: string;
  background?: SectionBackground;
}

const backgroundClass: Record<SectionBackground, string> = {
  cream: styles.cream,
  forest: styles.forest,
  transparent: styles.transparent,
};

/** Shared vertical rhythm + background/text-color pairing for page sections. */
function Section({
  children,
  id,
  as: Tag = 'section',
  className,
  background = 'transparent',
}: SectionProps) {
  const classes = [styles.section, backgroundClass[background], className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag id={id} className={classes}>
      {children}
    </Tag>
  );
}

export default Section;

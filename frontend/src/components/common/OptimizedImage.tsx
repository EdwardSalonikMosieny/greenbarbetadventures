import { useState } from 'react';
import styles from './OptimizedImage.module.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  srcSet?: string;
  sizes?: string;
  className?: string;
  /** Above-the-fold images (e.g. the hero photo) should set this to skip lazy-loading. */
  priority?: boolean;
}

// Shared <img> wrapper: lazy by default, with an eager/high-priority path for
// above-the-fold use. width/height are required so the browser can reserve
// layout space before the image loads (avoids CLS).
//
// Falls back to a neutral placeholder on load failure rather than a broken-image icon —
// several of the current placeholder photos are hotlinked from the old WordPress site,
// and at least one fails to decode in Firefox specifically (a malformed WebP file on
// that end, not something fixable from this codebase) while working fine in Chromium/
// WebKit. Real, self-hosted photography replacing these placeholders removes this
// failure mode entirely; this is the safety net until then.
function OptimizedImage({
  src,
  alt,
  width,
  height,
  srcSet,
  sizes,
  className,
  priority = false,
}: OptimizedImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={[styles.fallback, className].filter(Boolean).join(' ')}
        style={{ aspectRatio: `${width} / ${height}` }}
      />
    );
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
    />
  );
}

export default OptimizedImage;

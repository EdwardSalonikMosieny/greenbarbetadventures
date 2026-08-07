import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import styles from './Hero.module.css';

const HEADLINE = 'Dream, Explore, Discover';

// Real positioning copy, reused verbatim from the old site's hero slider captions
// (confirmed genuine — see Step 4 plan notes; only the demo-theme photos behind them were discarded).
const TAGLINES = [
  'Journey Into the Heart of Kenya',
  "Explore Nature's Hidden Treasures",
  'Discover the World Through Its Traditions',
  'Relax & Unwind on Paradise Shores',
];

// Real client footage — trimmed to ~8s/compressed from the original phone recordings
// (see scratchpad notes; originals are untouched in public/images/ under their upload names).
const HERO_VIDEOS: readonly { src: string; alt: string }[] = [
  { src: '/images/hero-elephant.mp4', alt: 'Elephants beside the track on a Green Barbet Adventures game drive' },
  { src: '/images/hero-giraffe.mp4', alt: 'A giraffe standing tall on the open plains' },
  { src: '/images/hero-lion.mp4', alt: 'A lion resting near safari vehicles in the Mara' },
  { src: '/images/hero-rhino.mp4', alt: 'A crash of rhinos crossing a bush track' },
  { src: '/images/hero-zebra.mp4', alt: 'A zebra grazing on the savanna' },
  { src: '/images/hero-elephant-close.mp4', alt: 'An elephant with ears flared, close up in tall grass' },
];

const TAGLINE_INTERVAL_MS = 4000;
const SCROLL_CUE_THRESHOLD = 50;
// How long a clip holds the screen before the next one wipes in, and how long that
// wipe itself takes. Both videos stay at full opacity throughout — only a clip-path
// reveal sweeps between them — so nothing ever dims mid-transition.
const SLIDE_INTERVAL_MS = 7000;
const WIPE_DURATION_S = 1;
const WIPE_EASE = [0.83, 0, 0.17, 1] as const;

const headlineContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const wordVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

const fadeUpBlock = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 1.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

interface CarouselState {
  /** HERO_VIDEOS index currently loaded into slot 0 and slot 1. */
  slotClip: [number, number];
  /** Which slot is doing the wipe-reveal (on top); the other sits underneath, always
   *  fully visible, showing whatever is currently "live". */
  frontSlot: 0 | 1;
  /** HERO_VIDEOS index to hand to whichever slot goes hidden next. */
  nextClip: number;
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const slotRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)] as const;

  const [taglineIndex, setTaglineIndex] = useState(0);
  const [pastScrollCue, setPastScrollCue] = useState(false);
  const [carousel, setCarousel] = useState<CarouselState>({
    slotClip: [0, 1],
    frontSlot: 1,
    nextClip: 2 % HERO_VIDEOS.length,
  });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINES.length);
    }, TAGLINE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  // Drives the video carousel: on each tick, the hidden ("front") slot wipes over the
  // visible one; once fully covered, that slot becomes the new steady background and the
  // other one — now hidden behind it — is loaded with the next clip in line, ready for
  // its own turn. Reduced motion freezes on the first clip rather than cycling.
  useEffect(() => {
    if (reduceMotion) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const intervalId = setInterval(() => {
      setRevealed(true);

      timeoutId = setTimeout(() => {
        setCarousel((prev) => {
          const newFront = prev.frontSlot === 0 ? 1 : 0;
          const slotClip: [number, number] = [...prev.slotClip];
          slotClip[newFront] = prev.nextClip;

          const el = slotRefs[newFront].current;
          if (el) {
            el.src = HERO_VIDEOS[prev.nextClip].src;
            el.load();
            el.play().catch(() => {});
          }

          return {
            slotClip,
            frontSlot: newFront,
            nextClip: (prev.nextClip + 1) % HERO_VIDEOS.length,
          };
        });
        setRevealed(false);
      }, WIPE_DURATION_S * 1000);
    }, SLIDE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
    // slotRefs is a fixed-length tuple of refs — stable identity, safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  useEffect(() => {
    function handleScroll() {
      setPastScrollCue(window.scrollY > SCROLL_CUE_THRESHOLD);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Background pans slower than the text as the hero scrolls away.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 80]);

  const words = HEADLINE.split(' ');
  const activeIndex = carousel.slotClip[carousel.frontSlot === 0 ? 1 : 0];

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.imageLayer}>
        <motion.div className={styles.imageMotion} style={{ y: parallaxY }}>
          {/* Decorative — the headline/tagline carry the actual message, so the
              rotating background is hidden from assistive tech. */}
          <div aria-hidden="true" className={styles.slideStack}>
            {([0, 1] as const).map((slot) => {
              const isFront = carousel.frontSlot === slot;
              const clipPath =
                isFront && !revealed ? 'inset(0 100% 0 0)' : 'inset(0 0% 0 0)';
              return (
                <motion.video
                  key={slot}
                  ref={slotRefs[slot]}
                  className={styles.photo}
                  style={{ zIndex: isFront ? 2 : 1 }}
                  animate={{ clipPath }}
                  transition={{
                    // Only the hidden->revealed sweep animates. The instant reset back to
                    // hidden right after a slot gets promoted/reassigned (revealed flips
                    // back to false) must snap immediately — animating that reset too was
                    // the bug: it produced a second, reversed wipe that briefly bled the
                    // next clip through over the one that had just finished revealing.
                    duration: reduceMotion || !isFront || !revealed ? 0 : WIPE_DURATION_S,
                    ease: WIPE_EASE,
                  }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  src={HERO_VIDEOS[carousel.slotClip[slot]].src}
                />
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className={styles.slideDots} aria-label="Hero video sequence">
        {HERO_VIDEOS.map((video, i) => (
          <span
            key={video.src}
            aria-hidden="true"
            className={i === activeIndex ? `${styles.dot} ${styles.dotActive}` : styles.dot}
          />
        ))}
      </div>

      <div className={styles.content}>
        <Container>
          <motion.h1
            className={styles.headline}
            variants={headlineContainer}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            {words.map((word, i) => (
              <motion.span key={i} variants={wordVariant} className={styles.word}>
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <div className={styles.taglineWrap} aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIndex}
                className={styles.tagline}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {TAGLINES[taglineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            className={styles.bottomBlock}
            variants={fadeUpBlock}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            <p className={styles.subtext}>Tailor-made safaris across Kenya’s wildlife, landscapes, and cultures.</p>

            <div className={styles.actions}>
              <Link to="/contact" className={styles.cta}>
                Book Now
              </Link>
            </div>

            <div className={styles.trustRow}>
              <span className={styles.stars} aria-hidden="true">
                ★★★★★
              </span>
              <a href="#testimonials">
                <strong>4.9</strong> from 600+ happy travelers
              </a>
            </div>
          </motion.div>
        </Container>
      </div>

      <motion.div
        className={styles.scrollCue}
        animate={{ opacity: pastScrollCue ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      >
        <span className={styles.scrollLine} />
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
          <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>
    </section>
  );
}

export default Hero;

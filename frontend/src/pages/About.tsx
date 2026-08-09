import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import OptimizedImage from '../components/common/OptimizedImage';
import AnimatedCounter from '../components/common/AnimatedCounter';
import FadeIn from '../components/common/FadeIn';
import useSeo from '../lib/useSeo';
import styles from './About.module.css';

function About() {
  useSeo({
    title: 'About Us',
    description:
      "Green Barbet Adventures is based near Naromoru, at the foot of Mount Kenya — 600+ travelers guided across Kenya's parks, conservancies, and coastline.",
  });

  return (
    <Section background="cream">
      <Container>
        <div className={styles.layout}>
          <FadeIn className={styles.storyCol}>
            <h1>About Green Barbet Adventures</h1>
            <p>
              Dream about the adventures you’ve always wanted to experience — the bucket-list
              journeys you’ve imagined but never thought would become reality. At Green Barbet
              Adventures, we create intimate, tailor-made safaris that immerse you in the
              breathtaking landscapes, wildlife, and cultures of Kenya, guided by experienced local
              guides who make every moment meaningful, exciting, and memorable.
            </p>
            <p>
              Founded by Willy, Green Barbet Adventures is based near Naromoru, at the foot of
              Mount Kenya — the gateway both to the mountain’s climbing routes and to the
              wildlife-rich reserves and conservancies beyond it. From here, we’ve guided over 600
              travelers through Kenya’s national parks, private conservancies, and coastline,
              building each itinerary around the real rhythm of the land rather than a fixed
              template.
            </p>
            <p>
              Whether it’s a honeymoon on the coast, a family safari through the Mara, a cultural
              visit to a Maasai or Samburu community, or a summit push on Mount Kenya, every trip is
              planned to leave a memory that’s genuinely theirs. We believe anyone can take a
              vacation — but only a few experience a true adventure. Dream, Explore, Discover isn’t
              just a tagline, it’s how each itinerary gets built.
            </p>

            <div className={styles.counterBlock}>
              <span className={styles.counterNumber}>
                <AnimatedCounter target={600} suffix="+" />
              </span>
              <span className={styles.counterLabel}>Travelers guided across Kenya</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className={styles.collageGrid}>
            <OptimizedImage
              src="/images/grevys-zebra-samburu.jpg"
              width={1391}
              height={1241}
              alt="A Grevy's zebra in the bush at Samburu National Reserve — wildlife safaris"
            />
            <OptimizedImage
              src="/images/maasai-manyatta.jpg"
              width={1600}
              height={352}
              alt="A Maasai manyatta homestead near the Masai Mara — cultural tours"
            />
            <OptimizedImage
              src="/images/mount-kenya-clear.jpg"
              width={1024}
              height={768}
              alt="Mount Kenya's Batian and Nelion peaks — mountain climbing and hikes"
            />
            <OptimizedImage
              src="/images/eqitorimage.jpeg"
              width={399}
              height={501}
              alt="The equator marker in Nanyuki, near Green Barbet Adventures' Naromoru base"
            />
          </FadeIn>
        </div>

        <div className={styles.pillars}>
          <FadeIn className={styles.pillar}>
            <h2>Our Mission</h2>
            <p>
              To make it effortless for travelers to experience the real Kenya — its wildlife,
              landscapes, and cultures — through itineraries built around each guest, not a
              template.
            </p>
          </FadeIn>
          <FadeIn className={styles.pillar} delay={0.1}>
            <h2>Our Vision</h2>
            <p>
              To be the trusted local guide for anyone exploring Kenya, known for genuine care and
              real, on-the-ground knowledge of every destination we send travelers to.
            </p>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}

export default About;

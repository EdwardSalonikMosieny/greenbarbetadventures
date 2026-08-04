import Hero from '../components/home/Hero';
import DestinationsTeaser from '../components/home/DestinationsTeaser';
import ToursTeaser from '../components/home/ToursTeaser';
import AboutTeaser from '../components/home/AboutTeaser';
import ServicesSection from '../components/home/ServicesSection';
import ActivitiesTeaser from '../components/home/ActivitiesTeaser';
import TestimonialsSection from '../components/home/TestimonialsSection';
import NewsletterSection from '../components/home/NewsletterSection';
import useSeo from '../lib/useSeo';

function Home() {
  useSeo({
    title: 'Dream, Explore, Discover',
    description:
      'Kenya-based tours and travel from Naromoru — wildlife safaris, cultural tours, luxury escapes, and Mount Kenya climbs. 600+ happy travelers.',
  });

  return (
    <>
      <Hero />
      <DestinationsTeaser />
      <ToursTeaser />
      <AboutTeaser />
      <ServicesSection />
      <ActivitiesTeaser />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}

export default Home;

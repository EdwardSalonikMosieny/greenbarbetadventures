// Typed static data for the four core service categories (Step 8: Services deep-dive).
// Slugs match TOUR_CATEGORIES in data/navigation.ts — each service links straight into
// its existing /tours/:slug category page rather than duplicating a new taxonomy.

export interface Service {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
}

export const SERVICES: readonly Service[] = [
  {
    slug: 'wildlife-safaris',
    title: 'Wildlife Safaris',
    description:
      'Game drives across Kenya’s greatest reserves — Samburu, the Masai Mara, Amboseli, Ol Pejeta, and beyond — tracking the Big Five and, in season, the great wildebeest migration.',
    imageUrl: '/images/image9.jpeg',
    imageWidth: 1472,
    imageHeight: 1472,
  },
  {
    slug: 'cultural-tours',
    title: 'Cultural Tours',
    description:
      'Step into Kenya’s living heritage — from Swahili Old Town in Mombasa to the traditions of the communities who call these landscapes home.',
    imageUrl: '/images/adumu-jumping-dance.jpg',
    imageWidth: 1600,
    imageHeight: 1200,
  },
  {
    slug: 'luxury-tours',
    title: 'Luxury Tours',
    description:
      'Unwind in style — white-sand escapes on Diani’s coastline, and premier lodges bordering some of Kenya’s wildest conservancies.',
    imageUrl: '/images/coastal-beach-aerial.jpg',
    imageWidth: 1600,
    imageHeight: 1200,
  },
  {
    slug: 'mountain-climbing-hikes',
    title: 'Mountain Climbing & Hikes',
    description:
      'Trek Mount Kenya’s glacial valleys and alpine lakes on a guided multi-day summit route to Point Lenana, Africa’s second-highest peak.',
    imageUrl: '/images/iamge5.jpeg',
    imageWidth: 1472,
    imageHeight: 1472,
  },
] as const;

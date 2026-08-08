// Typed static data for Step 9 (Activities). List confirmed with the user before
// building — see conversation. Images reuse verified-real destination/service photos
// where an activity ties directly to one place (e.g. rhino tracking → Ol Pejeta);
// no new stock images introduced.

export interface Activity {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  isFeatured: boolean;
}

export const ACTIVITIES: readonly Activity[] = [
  {
    slug: 'game-drives',
    title: 'Game Drives',
    description:
      'Morning and evening drives through Kenya’s reserves in an open-sided 4x4, tracking lion, elephant, and the Big Five with an experienced guide.',
    imageUrl: '/images/image15.jpeg',
    imageWidth: 1472,
    imageHeight: 1472,
    isFeatured: true,
  },
  {
    slug: 'mount-kenya-trekking',
    title: 'Mount Kenya Trekking',
    description:
      'Multi-day guided treks through glacial valleys and alpine lakes, summiting Point Lenana on Africa’s second-highest peak.',
    // A clear, unobstructed shot of Batian/Nelion's summit against open sky.
    imageUrl: '/images/mount-kenya-clear.jpg',
    imageWidth: 1024,
    imageHeight: 768,
    isFeatured: true,
  },
  {
    slug: 'rhino-tracking',
    title: 'Rhino Tracking',
    description:
      'Guided tracking at Ol Pejeta Conservancy, East Africa’s largest black rhino sanctuary and home to the last two northern white rhinos on Earth.',
    // Real client photo — a clear, close wild rhino mother and calf sighting.
    imageUrl: '/images/solio4.jpeg',
    imageWidth: 1280,
    imageHeight: 576,
    isFeatured: true,
  },
  {
    slug: 'bird-watching',
    title: 'Bird Watching',
    description:
      'Lake Nakuru’s soda-lake shoreline draws vast flamingo flocks alongside pelicans and fish eagles — a highlight for birders.',
    // Real client photo — a black-headed oriole. A second real bird photo (an augur
    // buzzard) from the same upload is in the main Gallery.
    imageUrl: '/images/birdwatching2.jpeg',
    imageWidth: 1344,
    imageHeight: 1234,
    isFeatured: true,
  },
  {
    slug: 'dhow-sunset-cruise',
    title: 'Dhow Sunset Cruise',
    description:
      'Sail the Indian Ocean on a traditional Swahili dhow as the sun sets over Mombasa’s coastline.',
    imageUrl: '/images/dhow-swahili-coast.jpg',
    imageWidth: 1600,
    imageHeight: 2000,
    isFeatured: false,
  },
  {
    slug: 'beach-snorkeling',
    title: 'Beach & Snorkeling',
    description:
      'White sand and coral reefs at Diani — snorkel the reef, then relax on Kenya’s premier stretch of coast.',
    imageUrl: '/images/coastal-beach-aerial.jpg',
    imageWidth: 1600,
    imageHeight: 1200,
    isFeatured: false,
  },
  {
    slug: 'bush-walks',
    title: 'Bush Walks',
    description:
      'Guided walks through Aberdares’ moorland and forest, low and slow enough to notice what a vehicle drives past.',
    imageUrl: '/images/aberdare3.jpeg',
    imageWidth: 1280,
    imageHeight: 576,
    isFeatured: false,
  },
] as const;

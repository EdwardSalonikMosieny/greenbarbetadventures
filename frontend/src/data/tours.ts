// Typed static tour data (no live backend yet — see Step 6 plan notes).
// Mirrors backend/prisma/seed.ts's tourData exactly, so this is a one-line swap
// for a real GET /api/v1/tours fetch once the backend route exists.
import { DESTINATIONS } from './destinations';

export type TourType = 'WILDLIFE_SAFARI' | 'CULTURAL' | 'LUXURY' | 'MOUNTAIN_CLIMBING' | 'CAMPING' | 'BIRDING';

// Matches the category slugs already defined in data/navigation.ts's TOUR_CATEGORIES.
export const TOUR_TYPE_TO_CATEGORY_SLUG: Record<TourType, string> = {
  WILDLIFE_SAFARI: 'wildlife-safaris',
  CULTURAL: 'cultural-tours',
  LUXURY: 'luxury-tours',
  MOUNTAIN_CLIMBING: 'mountain-climbing-hikes',
  CAMPING: 'camping',
  BIRDING: 'birding',
};

export interface ItineraryDay {
  day: number;
  summary: string;
}

export interface TourCoverImage {
  src: string;
  width: number;
  height: number;
  credit?: string;
}

export interface Tour {
  title: string;
  slug: string;
  description: string;
  itinerary: readonly ItineraryDay[];
  durationDays: number;
  durationNights: number;
  priceUsd: number;
  /** The original, higher price shown struck-through — inherited naming from the Prisma schema (see Step 6 plan). */
  discountPriceUsd: number | null;
  tourType: TourType;
  destinationSlug: string;
  /** Overrides the destination's hero photo on the tour card — for tour types (like
   *  Cultural) where the destination's own hero is wildlife-themed and wouldn't represent
   *  what the tour is actually about. */
  coverImage?: TourCoverImage;
  /** What's provided on multi-day treks — shown on the detail page below the itinerary. */
  included?: readonly string[];
  /** Packing list for multi-day treks — shown on the detail page below "Included". */
  whatToBring?: readonly string[];
  isFeatured: boolean;
}

export const TOURS: readonly Tour[] = [
  {
    title: '3-Day Mombasa Holiday Package',
    slug: '3-day-mombasa-holiday-package',
    description:
      'A relaxed coastal getaway through Mombasa’s Old Town, beaches, and Swahili cuisine.',
    itinerary: [
      { day: 1, summary: "Arrive in Mombasa and settle in, then take a guided walking tour through Old Town's narrow streets, Swahili architecture, and historic waterfront." },
      { day: 2, summary: 'Spend the day relaxing on the beach at Nyali or Diani, then round off the evening with a traditional dhow sunset cruise along the coast.' },
      { day: 3, summary: "Visit the 16th-century Fort Jesus before departure, with time to pick up last-minute souvenirs from Old Town's craft stalls." },
    ],
    durationDays: 3,
    durationNights: 2,
    priceUsd: 500,
    discountPriceUsd: null,
    tourType: 'LUXURY',
    destinationSlug: 'mombasa',
    isFeatured: false,
  },
  {
    title: '3-Day Samburu Wildlife Safari',
    slug: '3-day-samburu-wildlife-safari',
    description:
      'A short, high-density wildlife circuit through Samburu National Reserve’s riverine landscape.',
    itinerary: [
      { day: 1, summary: 'Drive from Nairobi to Samburu National Reserve, arriving in time for an afternoon game drive along the Ewaso Nyiro River.' },
      { day: 2, summary: "Spend a full day on game drives in search of the Samburu Special Five — Grevy's zebra, reticulated giraffe, Beisa oryx, gerenuk, and Somali ostrich." },
      { day: 3, summary: 'Enjoy one last morning game drive before the drive back to Nairobi.' },
    ],
    durationDays: 3,
    durationNights: 2,
    priceUsd: 720,
    discountPriceUsd: null,
    tourType: 'WILDLIFE_SAFARI',
    destinationSlug: 'samburu-national-reserve',
    isFeatured: true,
  },
  {
    title: '3-Day Aberdare Wilderness Safari',
    slug: '3-day-aberdare-wilderness-safari',
    description:
      'Montane forest and moorland safari through the Aberdares, with a chance to spot the elusive bongo.',
    itinerary: [
      { day: 1, summary: 'Drive to the Aberdares and head straight into an afternoon game drive through the montane forest.' },
      { day: 2, summary: "Spend a full day exploring the park's forest and moorland, with stops at some of its dramatic waterfalls." },
      { day: 3, summary: 'Take a final morning game drive before returning to Nairobi.' },
    ],
    durationDays: 3,
    durationNights: 2,
    priceUsd: 700,
    discountPriceUsd: null,
    tourType: 'WILDLIFE_SAFARI',
    destinationSlug: 'aberdares-national-park',
    isFeatured: false,
  },
  {
    title: '3-Day Masai Mara Wildebeest Migration Safari',
    slug: '3-day-masai-mara-wildebeest-migration-safari',
    description:
      'A classic Mara safari timed around the great wildebeest migration and Big Five game drives.',
    itinerary: [
      { day: 1, summary: 'Drive to the Masai Mara, arriving in time for an afternoon game drive across the open plains.' },
      { day: 2, summary: 'Spend a full day following the migration herds and watching for dramatic river crossings, timing and river levels permitting.' },
      { day: 3, summary: 'Take a final morning game drive before the drive back to Nairobi.' },
    ],
    durationDays: 3,
    durationNights: 2,
    priceUsd: 730,
    discountPriceUsd: null,
    tourType: 'WILDLIFE_SAFARI',
    destinationSlug: 'masai-mara-national-reserve',
    // Curated stock — swap for client migration photography when supplied.
    coverImage: {
      src: '/images/wildebeest-migration-herd.jpg',
      width: 1600,
      height: 1067,
    },
    isFeatured: true,
  },
  {
    title: '7-Day Best of Kenya Classic Bush Safari',
    slug: '7-day-best-of-kenya-classic-bush-safari',
    description:
      'A comprehensive circuit across Kenya’s premier parks and lakes — Nakuru, the Mara, Naivasha, and Amboseli.',
    itinerary: [
      {
        day: 1,
        summary:
          'Depart Nairobi and drive to Lake Nakuru National Park, famous for its scenic soda lake, diverse birdlife, and protected rhino population. Afternoon game drive in search of rhino, lion, buffalo, giraffe, and more.',
      },
      {
        day: 2,
        summary:
          "Drive from Lake Nakuru to the Masai Mara, arriving in time for lunch. Depending on arrival time, an afternoon game drive in search of the Mara's abundant wildlife.",
      },
      {
        day: 3,
        summary:
          'Full day of game drives across the Masai Mara, with opportunities to see the Big Five, cheetahs, giraffes, hippos, crocodiles, and numerous bird species. In migration season, watch for dramatic river crossings when conditions permit.',
      },
      {
        day: 4,
        summary:
          'Depart the Masai Mara and drive toward Lake Naivasha or Lake Elementaita. Afternoon boat ride on Lake Naivasha, surrounded by scenery and abundant birdlife — keep an eye out for hippos and waterbirds.',
      },
      {
        day: 5,
        summary:
          "Early morning departure toward Amboseli National Park, arriving for an afternoon game drive across its open plains and wetlands. Amboseli is renowned for its large elephant herds and, on clear mornings and late afternoons, spectacular views of Mount Kilimanjaro.",
      },
      {
        day: 6,
        summary:
          "Full day exploring Amboseli — close encounters with elephants and a search for lions, cheetahs, buffalo, giraffe, zebra, wildebeest, and hippos, with Mount Kilimanjaro as a backdrop for photography.",
      },
      {
        day: 7,
        summary:
          'Early morning game drive, weather and schedule permitting, then breakfast before departing Amboseli for the drive back to Nairobi, arriving in the afternoon.',
      },
    ],
    durationDays: 7,
    durationNights: 6,
    priceUsd: 460,
    discountPriceUsd: 670,
    tourType: 'WILDLIFE_SAFARI',
    destinationSlug: 'masai-mara-national-reserve',
    isFeatured: true,
  },
  // Split from a single combined "8-Day Aberdares & Mount Kenya Summit" package into two
  // standalone tours, each bookable on its own rather than only as a bundled circuit.
  {
    title: '2-Day Aberdares National Park Safari',
    slug: '2-day-aberdares-national-park-safari',
    description: 'A quick escape into the Aberdares — forest game drives and waterfalls in a single overnight.',
    itinerary: [
      { day: 1, summary: 'Drive from Nairobi to the Aberdares, arriving in time for an afternoon forest game drive.' },
      { day: 2, summary: "Spend a full day exploring the park's forest, moorland, and waterfalls before returning to Nairobi in the evening." },
    ],
    durationDays: 2,
    durationNights: 1,
    priceUsd: 520,
    discountPriceUsd: null,
    tourType: 'WILDLIFE_SAFARI',
    destinationSlug: 'aberdares-national-park',
    isFeatured: false,
  },
  {
    title: '6-Day Mount Kenya Summit Trek',
    slug: '6-day-mount-kenya-summit-trek',
    description: 'A guided trek to Point Lenana via Sirimon and out through Chogoria.',
    itinerary: [
      { day: 1, summary: "Drive from Nairobi to Mount Kenya's Sirimon Gate for registration and briefing before beginning the trek." },
      { day: 2, summary: "Trek through forest and heathland to Old Moses Camp, with early views of Mount Kenya's northern slopes." },
      { day: 3, summary: "Continue through Mackinder Valley to Shipton's Camp, beneath the peaks of Batian and Nelion." },
      { day: 4, summary: 'Make the early-morning summit push to Point Lenana, then descend towards Chogoria through a dramatically different landscape.' },
      { day: 5, summary: 'Continue the descent to Chogoria Gate, passing through moorland and forest before transferring out by vehicle.' },
      { day: 6, summary: 'Return to Nairobi, bringing the trek to a close.' },
    ],
    durationDays: 6,
    durationNights: 5,
    priceUsd: 540,
    discountPriceUsd: null,
    tourType: 'MOUNTAIN_CLIMBING',
    destinationSlug: 'mount-kenya-national-park',
    isFeatured: true,
  },
  {
    title: '3-Day Mount Kenya Trek (Naro Moru – Sirimon)',
    slug: '3-day-mount-kenya-naro-moru-sirimon-trek',
    description:
      'A demanding but rewarding 3-day summit of Point Lenana via the Naro Moru ascent and Sirimon descent — best suited to fit, well-acclimatized hikers. First-time trekkers may prefer our 4-day route for a gentler pace.',
    itinerary: [
      {
        day: 1,
        summary:
          'Pick-up from Nairobi or Naromoru, drive to Naro Moru Gate for registration and briefing, then trek through montane forest to Met Station Camp (3,050m) — 3–4 hours, 10km.',
      },
      {
        day: 2,
        summary:
          "Trek through the famous Vertical Bog into alpine moorland to Mackinder's Camp (4,200m), with views of Batian and Nelion — 6–7 hours, 10km. Rest and acclimatize before the summit attempt.",
      },
      {
        day: 3,
        summary:
          'Wake at 2:30am for the summit push, reaching Point Lenana (4,985m) in time for sunrise — 3–4 hours. Descend via Mackinder Valley and Old Moses Camp to Sirimon Gate — 6–8 hours — then transfer back to Naromoru or Nairobi.',
      },
    ],
    durationDays: 3,
    durationNights: 2,
    priceUsd: 420,
    discountPriceUsd: null,
    tourType: 'MOUNTAIN_CLIMBING',
    destinationSlug: 'mount-kenya-national-park',
    included: [
      'Professional mountain guide',
      'Experienced porters and cook',
      'Park entry fees (where included in your package)',
      'Accommodation in mountain huts or camping',
      'All meals during the trek',
      'Drinking water',
      'First aid kit and safety support',
      'Transport to and from the mountain',
    ],
    whatToBring: [
      'Warm jacket and thermal clothing',
      'Waterproof hiking boots',
      'Rain gear',
      'Headlamp with spare batteries',
      'Gloves, hat, sunglasses, and sunscreen',
      'Personal medication and toiletries',
      'Small daypack and reusable water bottle',
    ],
    isFeatured: false,
  },
  {
    title: '4-Day Mount Kenya Trek (Sirimon – Naro Moru)',
    slug: '4-day-mount-kenya-sirimon-naro-moru-trek',
    description:
      'A gentler, better-acclimatized 4-day summit of Point Lenana via the Sirimon ascent and quick Naro Moru descent — the route we generally recommend for first-time trekkers.',
    itinerary: [
      {
        day: 1,
        summary:
          'Pick-up from Nairobi or Naromoru, drive to Sirimon Gate for registration and briefing, then trek through forest and heathland to Old Moses Camp (3,300m) — 3–4 hours, 9km.',
      },
      {
        day: 2,
        summary:
          "Trek through Mackinder Valley past giant lobelias and groundsels to Shipton's Camp (4,200m), beneath Batian and Nelion — 6–7 hours, 14km.",
      },
      {
        day: 3,
        summary:
          "Wake around 3:00am for the summit attempt, reaching Point Lenana (4,985m) at sunrise — 8–9 hours round trip via Austrian Hut, descending to Mackinder's Camp (4,200m) to rest and celebrate.",
      },
      {
        day: 4,
        summary:
          'Descend through the Vertical Bog to Met Station, then through rainforest to Naro Moru Gate — 6–8 hours — before transferring back to Naromoru or Nairobi.',
      },
    ],
    durationDays: 4,
    durationNights: 3,
    priceUsd: 480,
    discountPriceUsd: null,
    tourType: 'MOUNTAIN_CLIMBING',
    destinationSlug: 'mount-kenya-national-park',
    included: [
      'Professional mountain guide',
      'Experienced cook and porters',
      'Mountain hut or camping accommodation',
      'All meals during the trek',
      'Drinking water',
      'First aid kit',
      'Transport to and from the mountain',
      'Park entry fees (where included in your package)',
    ],
    whatToBring: [
      'Waterproof hiking boots',
      'Warm clothing and thermal layers',
      'Waterproof jacket and trousers',
      'Headlamp with spare batteries',
      'Gloves and warm hat',
      'Sunglasses and sunscreen',
      'Trekking poles (recommended)',
      'Personal medication and toiletries',
      'Reusable water bottles',
    ],
    isFeatured: true,
  },
  {
    title: 'Solio Game Reserve Day Trip',
    slug: 'solio-game-reserve-day-trip',
    description:
      'A single-day rhino conservation safari from Naro Moru or Nanyuki, with a visit to the Solio Rhino Orphanage.',
    itinerary: [
      {
        day: 1,
        summary:
          "Early pick-up (6:30am) from Naro Moru or Nanyuki and drive to Solio Game Reserve, entering by 7:00am for a morning game drive through one of Kenya's key rhino conservation areas — black and white rhino, buffalo, giraffe, zebra, eland and other antelope, plus lion and other predators and a wide variety of birdlife. Mid-morning (around 10:30am), visit the Solio Rhino Orphanage for roughly an hour to learn about the care and rehabilitation of orphaned rhino calves — subject to the orphanage's own booking and availability, so we recommend confirming in advance. Continue the game drive afterward, break for a picnic lunch around 1:00pm at an approved spot (picnics inside the conservancy require Solio's prior approval), then an afternoon game drive before exiting the reserve around 4:00pm for the drive back, arriving in Naro Moru or Nanyuki by 4:30–5:00pm. Note: Solio's gates open at 6:30am with no entries accepted after 4:30pm; official gate passes are required and the reserve does not accept cash payments.",
      },
    ],
    durationDays: 1,
    durationNights: 0,
    // Internal placeholder — day trip has no published price from the owner yet; not shown
    // publicly regardless per the pricing display policy (see CLAUDE.md).
    priceUsd: 150,
    discountPriceUsd: null,
    tourType: 'WILDLIFE_SAFARI',
    destinationSlug: 'solio-game-reserve',
    included: [
      'Rhino conservation experience',
      'Visit to the Solio Rhino Orphanage',
      'Big-game viewing',
      'Giraffes and plains wildlife',
      'Birdwatching',
      'Photography opportunities',
      'Scenic views of the Laikipia landscape',
    ],
    isFeatured: false,
  },
  // Realistic seed data for the Cultural Tours category — Maasai and Samburu community
  // visits are genuine, widely-offered Kenyan cultural tourism experiences, built around
  // destinations already in DESTINATIONS (not invented locations).
  {
    title: '3-Day Maasai Cultural & Masai Mara Experience',
    slug: '3-day-maasai-cultural-masai-mara-experience',
    description:
      'A Masai Mara safari built around genuine time with a Maasai community — village life, beadwork, and tradition alongside the game drives.',
    itinerary: [
      { day: 1, summary: 'Drive to Masai Mara, afternoon visit to a Maasai manyatta (homestead) for a traditional welcome, house tour, and beadwork demonstration.' },
      { day: 2, summary: 'Morning game drive, afternoon at a local village market and cultural centre learning about Maasai customs and pastoralist life.' },
      { day: 3, summary: 'Sunrise game drive, morning departure.' },
    ],
    durationDays: 3,
    durationNights: 2,
    priceUsd: 690,
    discountPriceUsd: null,
    tourType: 'CULTURAL',
    destinationSlug: 'masai-mara-national-reserve',
    coverImage: {
      src: '/images/maasai-manyatta.jpg',
      width: 1600,
      height: 352,
      credit: 'Bjørn Christian Tørrissen, CC BY-SA 3.0, via Wikimedia Commons',
    },
    isFeatured: false,
  },
  {
    title: '3-Day Samburu Cultural & Wildlife Experience',
    slug: '3-day-samburu-cultural-wildlife-experience',
    description:
      'Wildlife along the Ewaso Nyiro River paired with real time in a Samburu village — dress, dance, and stories from the community itself.',
    itinerary: [
      { day: 1, summary: 'Drive to Samburu, afternoon visit to a Samburu village for traditional dress, song and dance, and beadwork craft.' },
      { day: 2, summary: 'Morning game drive along the Ewaso Nyiro River, afternoon cultural exchange and storytelling with Samburu elders.' },
      { day: 3, summary: 'Morning game drive, return to Nairobi.' },
    ],
    durationDays: 3,
    durationNights: 2,
    priceUsd: 700,
    discountPriceUsd: null,
    tourType: 'CULTURAL',
    destinationSlug: 'samburu-national-reserve',
    coverImage: {
      src: '/images/samburu-dancers.jpg',
      width: 1600,
      height: 1063,
      credit: 'Marta Panco, CC BY-SA 4.0, via Wikimedia Commons',
    },
    isFeatured: false,
  },
] as const;

/** The tour's destination — cover photo, name, and detail-page link all come from here. */
export function getTourDestination(tour: Tour) {
  const destination = DESTINATIONS.find((d) => d.slug === tour.destinationSlug);
  if (!destination) {
    throw new Error(`No destination found for slug "${tour.destinationSlug}"`);
  }
  return destination;
}

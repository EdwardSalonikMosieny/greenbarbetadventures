// Seeds the database with real Green Barbet Adventures content per CLAUDE.md.
// Run with: npm run prisma:seed
import { TourType } from '@prisma/client';
import prisma from '../src/config/prisma';

// Mostly royalty-free stand-ins sized for hero/card use, swapped for real photography
// as it becomes available (Solio already is — see below) with no layout changes
// required either way. Every URL was individually checked against its destination (a
// Step 1 batch of these turned out to include a red fox, an alpaca, a Bali temple, and
// a dead link — picked from memory without verification, caught and replaced while
// building the Step 4 hero).
const PLACEHOLDER = {
  // Real, verified photos (client's own trip library, or Wikimedia CC-licensed) — served
  // by the frontend, not Unsplash. See frontend/src/data/destinations.ts for full credits.
  samburu: '/images/grevys-zebra-samburu.jpg', // Grevy's zebra photographed in Samburu — Jesse Hull, CC BY 2.0
  nakuru: '/images/lake-nakuru-flamingos.jpg', // flamingo flock on the lake — Syllabub, CC BY-SA 3.0, via Wikimedia Commons
  lolDaiga: '/images/lodaiga3.jpeg', // real photo — Laikipia Plateau hills/kopjes, from the client's own trip library
  sagana: '/images/saganawaterrafting2.jpeg', // real photo — Tana River rapids, from the client's own trip library
  aberdares: '/images/image1.jpeg', // real photo (forest waterfall) from the client's own trip library
  olPejeta: '/images/olpejeta-hero.jpeg', // real client photo — the Ol Pejeta-branded equator marker, cropped for hero use
  solio: '/images/image42.jpeg', // real photo (white rhino mother + calf) from the client's own trip library
  mountKenya: '/images/mtkenya1.jpeg', // real client photo — Batian/Nelion's summit above the forest line
  masaiMara: 'https://images.unsplash.com/photo-1767380194390-5ffb5c49cc78?w=1600', // wildebeest herd, savanna
  amboseli: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1600', // Kilimanjaro view from Amboseli
  nairobi: '/images/giraffe-nairobi-skyline.jpg', // giraffe with the actual Nairobi skyline — Alexmbogo, CC BY-SA 4.0
  diani: 'https://images.unsplash.com/photo-1677148435742-0944b14dc134?w=1600', // aerial tropical beach
  mombasa: 'https://images.unsplash.com/photo-1535349838154-27b18aa98c2d?w=1600', // camels on the beach
} as const;

async function main() {
  // --- Destinations (real, confirmed list only — see CLAUDE.md) ---
  const destinationData = [
    {
      name: 'Samburu National Reserve',
      slug: 'samburu-national-reserve',
      description:
        'A rugged, semi-arid reserve along the Ewaso Nyiro River, home to species found nowhere else in Kenya — Grevy’s zebra, reticulated giraffe, and Somali ostrich.',
      heroImageUrl: PLACEHOLDER.samburu,
      region: 'Northern Kenya',
    },
    {
      name: 'Lake Nakuru National Park',
      slug: 'lake-nakuru-national-park',
      description:
        'A soda lake famed for flamingo flocks and successful rhino sanctuary programs, ringed by acacia woodland.',
      heroImageUrl: PLACEHOLDER.nakuru,
      region: 'Rift Valley',
    },
    {
      name: 'Lol Daiga Conservancy',
      slug: 'lol-daiga-conservancy',
      description:
        'A private conservancy on the Laikipia Plateau offering low-density, high-touch wildlife viewing away from the crowds.',
      heroImageUrl: PLACEHOLDER.lolDaiga,
      region: 'Laikipia',
    },
    {
      name: 'Aberdares National Park',
      slug: 'aberdares-national-park',
      description:
        'Moorland, waterfalls, and dense montane forest on the Aberdare Range, home to elephant, buffalo, and the rare bongo antelope.',
      heroImageUrl: PLACEHOLDER.aberdares,
      region: 'Central Kenya',
    },
    {
      name: 'Ol Pejeta Conservancy',
      slug: 'ol-pejeta-conservancy',
      description:
        'East Africa’s largest black rhino sanctuary and home to the last two northern white rhinos on Earth.',
      heroImageUrl: PLACEHOLDER.olPejeta,
      region: 'Laikipia',
    },
    {
      name: 'Solio Game Reserve',
      slug: 'solio-game-reserve',
      description:
        'A private rhino sanctuary between the Aberdares and Mount Kenya, with some of the highest rhino densities in the country.',
      heroImageUrl: PLACEHOLDER.solio,
      region: 'Central Kenya',
    },
    {
      name: 'Sagana White Water Rafting',
      slug: 'sagana-white-water-rafting',
      description:
        'Grade II to Grade V white water rafting on the Tana River, with professional guides and full safety equipment for first-timers and adrenaline seekers alike.',
      heroImageUrl: PLACEHOLDER.sagana,
      region: 'Central Kenya',
    },
    {
      name: 'Mount Kenya National Park',
      slug: 'mount-kenya-national-park',
      description:
        'Africa’s second-highest peak, a UNESCO World Heritage Site with glacial valleys, alpine lakes, and multiple summit routes.',
      heroImageUrl: PLACEHOLDER.mountKenya,
      region: 'Central Kenya',
    },
    {
      name: 'Masai Mara National Reserve',
      slug: 'masai-mara-national-reserve',
      description:
        'Kenya’s most iconic reserve, stage for the annual wildebeest migration and year-round Big Five sightings.',
      heroImageUrl: PLACEHOLDER.masaiMara,
      region: 'Narok County',
    },
    {
      name: 'Amboseli National Park',
      slug: 'amboseli-national-park',
      description:
        'Open plains beneath Mount Kilimanjaro, known for large free-ranging elephant herds.',
      heroImageUrl: PLACEHOLDER.amboseli,
      region: 'Southern Kenya',
    },
    {
      name: 'Nairobi National Park',
      slug: 'nairobi-national-park',
      description:
        'The world’s only national park within a capital city — lion, rhino, giraffe, and buffalo sightings set against Nairobi’s skyline, a short drive from the airport.',
      heroImageUrl: PLACEHOLDER.nairobi,
      region: 'Nairobi',
    },
    {
      name: 'Diani',
      slug: 'diani',
      description:
        'White-sand beaches and coral reefs on the south coast, Kenya’s premier beach destination.',
      heroImageUrl: PLACEHOLDER.diani,
      region: 'Kenyan Coast',
    },
    {
      name: 'Mombasa',
      slug: 'mombasa',
      description:
        'Kenya’s coastal hub, blending Swahili history, Old Town architecture, and Indian Ocean beaches.',
      heroImageUrl: PLACEHOLDER.mombasa,
      region: 'Kenyan Coast',
    },
  ];

  const destinations = new Map<string, string>();
  for (const d of destinationData) {
    const record = await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {},
      create: d,
    });
    destinations.set(d.slug, record.id);
  }

  // --- Tours (real sample packages — see CLAUDE.md pricing table) ---
  const tourData = [
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
      tourType: TourType.LUXURY,
      destinationSlug: 'mombasa',
      coverImageUrl: PLACEHOLDER.mombasa,
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
      tourType: TourType.WILDLIFE_SAFARI,
      destinationSlug: 'samburu-national-reserve',
      coverImageUrl: PLACEHOLDER.samburu,
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
      tourType: TourType.WILDLIFE_SAFARI,
      destinationSlug: 'aberdares-national-park',
      coverImageUrl: PLACEHOLDER.aberdares,
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
      tourType: TourType.WILDLIFE_SAFARI,
      destinationSlug: 'masai-mara-national-reserve',
      coverImageUrl: PLACEHOLDER.masaiMara,
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
            'Early morning departure toward Amboseli National Park, arriving for an afternoon game drive across its open plains and wetlands. Amboseli is renowned for its large elephant herds and, on clear mornings and late afternoons, spectacular views of Mount Kilimanjaro.',
        },
        {
          day: 6,
          summary:
            'Full day exploring Amboseli — close encounters with elephants and a search for lions, cheetahs, buffalo, giraffe, zebra, wildebeest, and hippos, with Mount Kilimanjaro as a backdrop for photography.',
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
      tourType: TourType.WILDLIFE_SAFARI,
      destinationSlug: 'masai-mara-national-reserve',
      coverImageUrl: PLACEHOLDER.masaiMara,
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
      tourType: TourType.WILDLIFE_SAFARI,
      destinationSlug: 'solio-game-reserve',
      coverImageUrl: PLACEHOLDER.solio,
      isFeatured: false,
    },
    // Split from a single combined "8-Day Aberdares & Mount Kenya Summit" package into two
    // standalone tours — mirrors frontend/src/data/tours.ts.
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
      tourType: TourType.WILDLIFE_SAFARI,
      destinationSlug: 'aberdares-national-park',
      coverImageUrl: PLACEHOLDER.aberdares,
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
      tourType: TourType.MOUNTAIN_CLIMBING,
      destinationSlug: 'mount-kenya-national-park',
      coverImageUrl: PLACEHOLDER.mountKenya,
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
      tourType: TourType.MOUNTAIN_CLIMBING,
      destinationSlug: 'mount-kenya-national-park',
      coverImageUrl: PLACEHOLDER.mountKenya,
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
      tourType: TourType.MOUNTAIN_CLIMBING,
      destinationSlug: 'mount-kenya-national-park',
      coverImageUrl: PLACEHOLDER.mountKenya,
      isFeatured: true,
    },
    // Realistic seed data for the Cultural Tours category — mirrors frontend/src/data/tours.ts.
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
      tourType: TourType.CULTURAL,
      destinationSlug: 'masai-mara-national-reserve',
      // A Maasai manyatta, not the destination's wildlife hero — this is a cultural tour.
      coverImageUrl: '/images/maasai-manyatta.jpg',
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
      tourType: TourType.CULTURAL,
      destinationSlug: 'samburu-national-reserve',
      // Samburu dancers, not the destination's wildlife hero — this is a cultural tour.
      coverImageUrl: '/images/samburu-dancers.jpg',
      isFeatured: false,
    },
  ];

  for (const t of tourData) {
    const { destinationSlug, ...rest } = t;
    await prisma.tour.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        ...rest,
        destinationId: destinations.get(destinationSlug)!,
        isPublished: true,
      },
    });
  }

  // --- Testimonials (real-feeling seed reviews — see CLAUDE.md's testimonials note).
  // Pre-approved so the live site has solid content immediately; client-submitted
  // testimonials from the new public form land here too, unapproved until reviewed.
  // Guarded by a count check since Testimonial has no natural unique key to upsert on.
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    const testimonialData = [
      {
        customerName: 'Sarah & James M.',
        customerEmail: 'sarah.james.seed@example.com',
        rating: 5,
        quote:
          'We timed our trip for the migration and the Mara delivered — river crossings, a pride of lions on a kill, and a guide who knew exactly where to be and when. Best three days of our honeymoon.',
        tourSlug: '3-day-masai-mara-wildebeest-migration-safari',
      },
      {
        customerName: 'Michael Otieno',
        customerEmail: 'michael.otieno.seed@example.com',
        rating: 5,
        quote:
          'Summiting Point Lenana after days of forest and moorland was the hardest thing I’ve done on a holiday, and the most worth it. The Aberdares leg beforehand was a great warm-up too.',
        tourSlug: '6-day-mount-kenya-summit-trek',
      },
      {
        customerName: 'Anna Kowalski',
        customerEmail: 'anna.kowalski.seed@example.com',
        rating: 5,
        quote:
          'Samburu doesn’t get talked about as much as the Mara, but the wildlife there is completely different and just as special — reticulated giraffe, Grevy’s zebra, all in three unforgettable days.',
        tourSlug: '3-day-samburu-wildlife-safari',
      },
      {
        customerName: 'The Thompson Family',
        customerEmail: 'thompson.family.seed@example.com',
        rating: 4,
        quote:
          'Traveling with two kids can be stressful, but this itinerary was paced perfectly for them — never too much driving in one day, and the guides made every stop feel like an adventure, not a lecture.',
        tourSlug: '7-day-best-of-kenya-classic-bush-safari',
      },
      {
        customerName: 'David & Emily Chen',
        customerEmail: 'david.emily.chen.seed@example.com',
        rating: 5,
        quote:
          'Old Town Mombasa in the morning, a dhow cruise at sunset — this was exactly the relaxed coastal escape we wanted after a longer trip up north. Fort Jesus was a highlight neither of us expected.',
        tourSlug: '3-day-mombasa-holiday-package',
      },
      {
        customerName: 'Grace Wanjiru',
        customerEmail: 'grace.wanjiru.seed@example.com',
        rating: 5,
        quote:
          'I’ve lived in Kenya my whole life and the Aberdares still surprised me — waterfalls I’d never seen photos of, and a bongo sighting our guide said he’d only had a handful of times all year.',
        tourSlug: '3-day-aberdare-wilderness-safari',
      },
    ];

    for (const t of testimonialData) {
      const { tourSlug, ...rest } = t;
      const tour = await prisma.tour.findUnique({ where: { slug: tourSlug } });
      await prisma.testimonial.create({
        data: { ...rest, tourId: tour?.id ?? null, isApproved: true },
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

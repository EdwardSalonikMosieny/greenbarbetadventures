// Optional per-category enrichment for the Tours category pages (frontend-only, not part
// of the Prisma schema) — most categories use ToursCategory's generic intro; a category
// gets an entry here only when there's real, specific copy/photos worth adding.

export interface CategoryPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Required by the source photo's license (e.g. Wikimedia CC BY) — shown as a small caption. */
  credit?: string;
}

export interface CategoryContent {
  intro: string;
  photos?: CategoryPhoto[];
}

export const TOUR_CATEGORY_CONTENT: Partial<Record<string, CategoryContent>> = {
  birding: {
    intro:
      "Discover the incredible world of birds with Green Barbet Adventures. Kenya is home to more than 1,100 bird species, making it one of Africa's premier birdwatching destinations. Join our experienced local guides as you explore diverse habitats, from the forests of Mt. Kenya and Aberdare National Park to the wetlands of Lake Nakuru, the savannahs of Samburu, and the plains of Laikipia. Whether you're hoping to spot rare endemics, colorful barbets, majestic raptors, or migratory species, every outing offers exciting discoveries. Our birding tours are designed for beginners, experienced birders, photographers, and nature enthusiasts, combining expert guidance, comfortable transport, and a passion for conservation. Come and discover Kenya — one bird at a time.",
    photos: [
      {
        src: '/images/birdwatching.jpeg',
        alt: 'An augur buzzard perched on a bare branch against blue sky',
        width: 1600,
        height: 899,
      },
      {
        src: '/images/birdwatching2.jpeg',
        alt: 'A black-headed oriole perched on a rock',
        width: 1344,
        height: 1234,
      },
      {
        src: '/images/image79.jpeg',
        alt: 'A kori bustard walking along a riverbank',
        width: 1280,
        height: 576,
      },
      {
        src: '/images/birdwatching 3.jpeg',
        alt: 'A vulturine guineafowl, a striking species found in Samburu and northern Kenya',
        width: 1141,
        height: 1600,
      },
      {
        src: '/images/birdwatching4.jpeg',
        alt: 'An African hoopoe with an insect in its beak',
        width: 1600,
        height: 1066,
      },
      {
        src: '/images/birdwatching5.jpeg',
        alt: 'A yellow-billed stork on a sandbar along the Ewaso Nyiro River',
        width: 1280,
        height: 1280,
      },
      {
        src: '/images/birdwatching3.jpeg',
        alt: 'An Eurasian collared dove perched on a branch',
        width: 2048,
        height: 1366,
      },
      {
        src: '/images/birdwatching6.jpeg',
        alt: "A weaver bird's woven nest hanging from an acacia branch",
        width: 1280,
        height: 1280,
      },
    ],
  },
  camping: {
    intro:
      "Green Barbet Adventures offers reliable, high-quality camping equipment rental for your outdoor adventures across Kenya. Whether you're planning a weekend getaway, a mountain hike, a safari, or a multi-day camping expedition, we have the gear you need for a safe and comfortable experience. Our rental equipment includes spacious camping tents, sleeping bags and mattresses, camping chairs and tables, cooking equipment and utensils, and lanterns and other essential camping accessories — all clean, well-maintained, and suitable for solo travelers, families, groups, schools, and corporate teams. Travel light and camp with confidence — Green Barbet Adventures has everything you need for your next outdoor adventure.",
    photos: [
      {
        src: '/images/camping equipments.jpeg',
        alt: 'A full set of rental camping equipment — tent, sleeping bag, backpack, and outdoor gear',
        width: 720,
        height: 405,
      },
      {
        src: '/images/camping5.jpeg',
        alt: 'Rental tents pitched on a quiet lawn campsite',
        width: 1472,
        height: 1472,
      },
      {
        src: '/images/camping1.jpeg',
        alt: 'Our team pitching rental tents ahead of a trip',
        width: 1600,
        height: 702,
      },
    ],
  },
  'cultural-tours': {
    intro:
      "Cultural tours near Nanyuki and across Kenya offer deeply immersive experiences into indigenous heritage, traditional craftsmanship, and local history. Here are the top curated cultural experiences and heritage tours available in the region:",
    photos: [
      {
        src: '/images/maasai-manyatta.jpg',
        alt: 'A Maasai manyatta homestead near the Masai Mara',
        width: 1600,
        height: 352,
        credit: 'Bjørn Christian Tørrissen, CC BY-SA 3.0, via Wikimedia Commons',
      },
      {
        src: '/images/samburu-dancers.jpg',
        alt: 'Samburu people in traditional dress at a cultural gathering',
        width: 1600,
        height: 1063,
        credit: 'Marta Panco, CC BY-SA 4.0, via Wikimedia Commons',
      },
      {
        src: '/images/samburu-neck-dancing.jpg',
        alt: 'Samburu women in traditional beaded collars, singing and dancing',
        width: 1600,
        height: 1064,
        credit: 'Sefika Safari, CC BY-SA 4.0, via Wikimedia Commons',
      },
    ],
  },
};

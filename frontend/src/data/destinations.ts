// Typed static destination data (no live backend yet — see Step 5 plan notes).
// Matches the shape backend/prisma/schema.prisma's Destination model already defines,
// so swapping this for a real GET /api/v1/destinations fetch later is a one-line change.

export interface DestinationGalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Required by the source photo's license (e.g. Wikimedia CC BY) — shown as a small caption. Omitted for the client's own real trip photos. */
  credit?: string;
}

export interface Destination {
  slug: string;
  name: string;
  region: string;
  /** Short summary — used on the detail page intro and folded into its meta description, so kept to a sentence or two. */
  description: string;
  /** Longer, detail-page-only body copy, one entry per paragraph. Every destination has at least one. */
  details: readonly string[];
  heroImageUrl: string;
  heroImageWidth: number;
  heroImageHeight: number;
  /** Required by the hero photo's license (e.g. Wikimedia CC BY) — shown as a small caption. Omitted for the client's own real trip photos. */
  heroImageCredit?: string;
  /** Extra photos shown in a horizontally-scrollable strip on the detail page. */
  gallery?: DestinationGalleryImage[];
  /** Number of published tours at this destination. Omitted (not 0) when none exist yet. */
  tourCount?: number;
  isFeatured: boolean;
}

export const DESTINATIONS: readonly Destination[] = [
  {
    slug: 'samburu-national-reserve',
    name: 'Samburu National Reserve',
    region: 'Northern Kenya',
    description:
      'A rugged, semi-arid reserve along the Ewaso Nyiro River, home to species found nowhere else in Kenya — Grevy’s zebra, reticulated giraffe, and Somali ostrich.',
    details: [
      "Discover the wild beauty of Samburu Game Reserve with Green Barbet Adventures. Experience the breathtaking landscapes of Northern Kenya and encounter the unique Samburu Special Five — Grevy's zebra, reticulated giraffe, Beisa oryx, Somali ostrich, and gerenuk. Explore the reserve's rich birdlife and diverse wildlife, and immerse yourself in the vibrant culture and traditions of the Samburu people for an unforgettable safari experience. We offer overnight trips from Naromoru and Nanyuki, with comfortable 4x4 safari vehicles and knowledgeable local guides who ensure every journey is memorable. Whether you're a wildlife enthusiast, bird lover, photographer, or adventure seeker, Samburu promises an experience unlike any other.",
      "Samburu sits in Kenya's arid north, where the Ewaso Nyiro River is the lifeline that draws elephant herds, lion, and leopard out of the surrounding scrub to drink and cool off. It borders the Samburu people's own grazing lands, and game drives here often double as an introduction to their semi-nomadic, pastoralist way of life. Fewer visitors make it out this far than to the Mara, so sightings tend to feel less crowded and more personal.",
    ],
    // Grevy's zebra — Samburu's signature, most distinctive species (narrow stripes, huge
    // rounded ears, white belly) — photographed in Samburu itself. Swapped in for the old
    // site's generic hotlinked landscape shot.
    heroImageUrl: '/images/grevys-zebra-samburu.jpg',
    heroImageWidth: 1391,
    heroImageHeight: 1241,
    heroImageCredit: 'Jesse Hull, CC BY 2.0, via Wikimedia Commons',
    // Reticulated giraffe is geographically restricted to northern Kenya, so this real
    // client photo is a safe match for Samburu even without an explicit location tag.
    gallery: [
      {
        src: '/images/image49.jpeg',
        alt: 'Reticulated giraffes browsing acacia trees',
        width: 1472,
        height: 1472,
      },
    ],
    tourCount: 2,
    isFeatured: true,
  },
  {
    slug: 'lake-nakuru-national-park',
    name: 'Lake Nakuru National Park',
    region: 'Rift Valley',
    description:
      'A soda lake famed for flamingo flocks and successful rhino sanctuary programs, ringed by acacia woodland.',
    details: [
      "Once famous for vast flamingo flocks that turned its shoreline pink, Lake Nakuru's water levels have shifted in recent years, but the park remains one of Kenya's most reliable spots for both black and white rhino, protected inside a predator-proof perimeter fence. Its acacia woodland and grassy shoreline also support Rothschild's giraffe, buffalo, and healthy lion and leopard populations, all within a compact area that's easy to cover in a single day's game drive from Nairobi or the Rift Valley.",
    ],
    heroImageUrl: '/images/lake-nakuru-flamingos.jpg',
    heroImageWidth: 1600,
    heroImageHeight: 1064,
    heroImageCredit: 'Syllabub, CC BY-SA 3.0, via Wikimedia Commons',
    isFeatured: false,
  },
  {
    slug: 'lol-daiga-conservancy',
    name: 'Lol Daiga Conservancy',
    region: 'Laikipia',
    description:
      'A private conservancy on the Laikipia Plateau offering low-density, high-touch wildlife viewing away from the crowds.',
    details: [
      "Escape to the breathtaking Lolldaiga Conservancy, one of Laikipia's most exclusive wildlife destinations, just a short drive from Nanyuki. A typical day trip starts with a morning departure from Nanyuki or Naromoru for a scenic game drive through this private conservancy, with excellent chances of seeing elephant, buffalo, lion, leopard, giraffe, Grevy's zebra, eland, oryx, hyena, and a wide range of antelope species, alongside birdwatching among more than 300 recorded species. Along the way there are scenic viewpoints over Mount Kenya and the Laikipia Plateau, an optional guided nature walk where availability allows, and a bush picnic or packed lunch out in the wilderness before an afternoon game drive and the return leg.",
      "A day trip here includes transport in a 4x4 safari Land Cruiser, a professional driver-guide, the conservancy game drive itself, drinking water, and pick-up and drop-off from Nanyuki or Naromoru. With far fewer vehicles than the well-known reserves, Lolldaiga offers a genuinely private safari experience — beautiful landscapes for photography, exceptional wildlife viewing, and a natural fit for families, photographers, birders, and anyone who wants Kenya's wildlife without the crowds.",
      "Laikipia's rolling ranchland and conservancies are also home to one of Africa's rarest wildlife sightings: the black leopard. A melanistic leopard nicknamed Giza became internationally famous in 2019 after being photographed in this same Laikipia region — the first confirmed images of an African black leopard in roughly a century. Sightings are exceptionally rare and never guaranteed, but Lolldaiga's low vehicle density and Laikipia's healthy leopard population make it one of the more credible places in Kenya to be in the right place at the right time.",
    ],
    // Real client photo — the Laikipia Plateau's rolling hills and kopjes, taken on a
    // Lolldaiga trip — swapped in for the old site's hotlinked stock photo.
    heroImageUrl: '/images/lodaiga3.jpeg',
    heroImageWidth: 1599,
    heroImageHeight: 1200,
    gallery: [
      {
        src: '/images/oldaiga.jpeg',
        alt: 'The entrance sign for Lolldaiga Conservancy',
        width: 1280,
        height: 576,
      },
      {
        src: '/images/loldaiga2.jpeg',
        alt: 'Rolling hills and a rocky kopje across the Laikipia Plateau',
        width: 1600,
        height: 899,
      },
      {
        src: '/images/loldaiga1.jpeg',
        alt: 'A lioness with three cubs walking through open grassland',
        width: 1599,
        height: 1103,
      },
      {
        src: '/images/lodaiga4.jpeg',
        alt: 'Two cheetah cubs sitting together in the grass',
        width: 1600,
        height: 1136,
      },
      {
        src: '/images/lodaiga8.jpeg',
        alt: 'A reticulated giraffe browsing an acacia tree',
        width: 1600,
        height: 899,
      },
      {
        src: '/images/lodaiga11.jpeg',
        alt: 'Three lion cubs perched on a termite mound',
        width: 1599,
        height: 1066,
      },
      {
        src: '/images/lodaiga14.jpeg',
        alt: 'An elephant family browsing thorn trees together',
        width: 1600,
        height: 1066,
      },
    ],
    isFeatured: true,
  },
  {
    slug: 'aberdares-national-park',
    name: 'Aberdares National Park',
    region: 'Central Kenya',
    description:
      'Moorland, waterfalls, and dense montane forest on the Aberdare Range, home to elephant, buffalo, and the rare bongo antelope.',
    details: [
      "Explore Aberdare National Park with Green Barbet Adventures. It's home to the rare and elusive mountain bongo, the giant forest hog, and four of the Big Five — keep an eye out for leopard, the park's top predator, as you move through its dense forests and moorlands. Don't miss Karuru Falls, the tallest waterfall in Kenya, framed by lush indigenous forest. Adventure awaits: day hikes to Ol Doinyo Lesatima, Kenya's third-highest peak; guided 3- and 4-day hiking expeditions through the Aberdare ranges; camping under the African sky; and wildlife viewing, birdwatching, and photography throughout. Whether you're after a hike, a wildlife safari, or a peaceful camping escape, we'll make your Aberdare experience unforgettable.",
      "The range itself rises from bamboo forest at around 1,800m to windswept alpine moorland above 4,000m near the Ol Doinyo Lesatima summit — a single park that feels like several different countries stacked on top of one another. Two of Kenya's most historic lodges, The Ark and Treetops, were built directly over floodlit waterholes and salt licks so guests can watch wildlife through the night; Treetops is where a young Princess Elizabeth was staying in 1952 when she learned she had become Queen. Pack warm layers — at this altitude, misty, cool weather is the norm even this close to the equator.",
    ],
    // Real photo from the client's own trip library — a forest waterfall viewpoint in the
    // Aberdares — swapped in for the old site's hotlinked stock photo.
    heroImageUrl: '/images/image1.jpeg',
    heroImageWidth: 1472,
    heroImageHeight: 1472,
    gallery: [
      {
        src: '/images/image3.jpeg',
        alt: 'Resting at the forest waterfall viewpoint in the Aberdares',
        width: 1472,
        height: 1472,
      },
      {
        src: '/images/image44.jpeg',
        alt: 'A bushbuck on a forest trail in the Aberdares',
        width: 1472,
        height: 1472,
      },
      {
        src: '/images/elephant-aberdare.jpg',
        alt: 'A bull elephant browsing in the misty Aberdare forest',
        width: 1600,
        height: 1067,
        credit: 'BIT1982, CC BY-SA 3.0, via Wikimedia Commons',
      },
      {
        src: '/images/aberdare2.jpeg',
        alt: 'A hiker approaching a tall waterfall through misty highland grass',
        width: 576,
        height: 1280,
      },
      {
        src: '/images/aberdare5.jpeg',
        alt: 'A tall waterfall dropping through dense Aberdare forest',
        width: 576,
        height: 1280,
      },
      {
        src: '/images/aberdare3.jpeg',
        alt: 'Misty rapids at the edge of a forest waterfall',
        width: 1280,
        height: 576,
      },
      {
        src: '/images/aberdare4.jpeg',
        alt: 'A spotted hyena crossing a forest track',
        width: 1280,
        height: 576,
      },
      {
        src: '/images/aerdarephoto1.jpeg',
        alt: 'The trail sign at Karuru Falls marking its three-step drop',
        width: 1280,
        height: 576,
      },
    ],
    tourCount: 2,
    isFeatured: true,
  },
  {
    slug: 'ol-pejeta-conservancy',
    name: 'Ol Pejeta Conservancy',
    region: 'Laikipia',
    description:
      'East Africa’s largest black rhino sanctuary and home to the last two northern white rhinos on Earth.',
    details: [
      "Ol Pejeta sits on the Laikipia Plateau just south of Nanyuki — itself famous as one of the few places on the planet where you can stand with one foot in each hemisphere at the marked equator crossing on the Nyeri–Nanyuki road, a popular stop on the way in or out of the conservancy. Inside, Ol Pejeta protects the largest black rhino population in East Africa and is home to Najin and Fatu, the last two northern white rhinos left on Earth, kept under 24-hour armed guard. It's also one of the few conservancies with all of the Big Five, plus Sweetwaters Chimpanzee Sanctuary, East Africa's only chimpanzee sanctuary, home to chimps rescued from captivity and conflict elsewhere in Africa. Conservation fees paid by visitors fund the anti-poaching and community programs that keep it all running.",
    ],
    // Real client photo — the "You Are on the Equator" marker branded with the Ol Pejeta
    // Conservancy sign, an unmistakable, well-known Ol Pejeta landmark. Cropped from the
    // original square upload to a hero-friendly ratio that keeps the full sign in frame
    // (the square original made object-fit: cover crop off the top/bottom text).
    heroImageUrl: '/images/olpejeta-hero.jpeg',
    heroImageWidth: 1472,
    heroImageHeight: 900,
    gallery: [
      {
        // Real photo supplied by the client — a black leopard (a genuine, well-documented
        // melanistic leopard individual in Laikipia's conservancies) drinking at a waterhole.
        src: '/images/giza.jpeg',
        alt: 'A black leopard drinking at a waterhole in Laikipia',
        width: 720,
        height: 424,
      },
      {
        src: '/images/olpejatapic3.jpeg',
        alt: 'A group of white rhinos grazing on open grassland with Mount Kenya in the distance',
        width: 679,
        height: 452,
      },
      {
        src: '/images/olpejetapic2.jpeg',
        alt: 'A male lion roaring in tall grass against a clear blue sky',
        width: 679,
        height: 451,
      },
      {
        src: '/images/olpejtapic1.jpeg',
        alt: 'A mixed herd of oryx and reticulated giraffes grazing on open plains',
        width: 739,
        height: 415,
      },
    ],
    isFeatured: false,
  },
  {
    slug: 'solio-game-reserve',
    name: 'Solio Game Reserve',
    region: 'Central Kenya',
    description:
      'A private rhino sanctuary between the Aberdares and Mount Kenya, with some of the highest rhino densities in the country.',
    details: [
      "Experience Solio like a local with Green Barbet Adventures. We're based just a couple of kilometres from the Solio Rhino Gate, making us your ideal local safari partner — our guides call Solio home, bringing an authentic, story-rich perspective on the wildlife, conservation work, and natural heritage of the area. A highlight of any visit is the Solio Rhino Orphanage, where you'll learn about the work being done to rescue, rehabilitate, and protect orphaned rhino calves before they're returned to the wild. Join us for a game drive and get close encounters with black and white rhino, lion, leopard, buffalo, giraffe, zebra, and a wide variety of birdlife, all in their natural habitat.",
      "Founded in 1970 on a working cattle ranch, Solio was the world's first private rhino sanctuary and remains one of its most successful — a fenced, roughly 7,100-hectare (17,500-acre) reserve 22km north of Nyeri, sitting in the shadow of both the Aberdares and Mount Kenya. Its high, well-protected rhino density has made Solio a source population for the rest of the country: dozens of black and white rhino bred here have gone on to restock reserves across Kenya and beyond. Beyond rhino, the reserve holds healthy numbers of buffalo, zebra, giraffe, eland, oryx, waterbuck, Thomson's gazelle, and warthog on open, easy-to-view grassland.",
    ],
    // Real photo from the client's own trip library (public/images/image42.jpeg) — a
    // white rhino mother and calf, swapped in for the old-site hotlinked stock photo.
    heroImageUrl: '/images/image42.jpeg',
    heroImageWidth: 1472,
    heroImageHeight: 1472,
    gallery: [
      {
        src: '/images/rhino-solio.jpg',
        alt: 'A young white rhino calf at Solio Ranch',
        width: 1600,
        height: 1067,
        credit: 'Valentina Storti, CC BY 2.0, via Wikimedia Commons',
      },
      {
        src: '/images/image1rhinos.jpeg',
        alt: 'Two black rhinos walking together through the bush',
        width: 1472,
        height: 1472,
      },
      {
        src: '/images/images2rhinos.jpeg',
        alt: 'Black rhinos in a close encounter in the bush',
        width: 1472,
        height: 1472,
      },
      {
        src: '/images/image27.jpeg',
        alt: 'Camp chairs set up with a rhino grazing in the distance',
        width: 1472,
        height: 1472,
      },
      {
        src: '/images/solioophanage.jpeg',
        alt: 'A rescued baby rhino being cared for at the Solio Rhino Orphanage',
        width: 1280,
        height: 576,
      },
      {
        src: '/images/solioophanage2.jpeg',
        alt: 'Orphaned rhino calves being walked by keepers at Solio',
        width: 1280,
        height: 576,
      },
      {
        src: '/images/soiloophanage3.jpeg',
        alt: 'A ranger leading two orphaned rhino calves at Solio',
        width: 1280,
        height: 576,
      },
      {
        src: '/images/solio4.jpeg',
        alt: 'A wild rhino mother and calf at Solio',
        width: 1280,
        height: 576,
      },
      {
        src: '/images/solio2.jpeg',
        alt: 'A spotted hyena cub at Solio',
        width: 1280,
        height: 1280,
      },
      {
        src: '/images/solio3.jpeg',
        alt: 'A striped hyena crossing a track at Solio',
        width: 1280,
        height: 1280,
      },
    ],
    isFeatured: true,
  },
  {
    slug: 'sagana-white-water-rafting',
    name: 'Sagana White Water Rafting',
    region: 'Central Kenya',
    description:
      'Grade II to Grade V white water rafting on the Tana River, with professional guides and full safety equipment for first-timers and adrenaline seekers alike.',
    details: [
      "Experience the thrill of white water rafting on the Tana River with Green Barbet Adventures. Conquer exciting Grade II to Grade V rapids as you paddle through breathtaking scenery under the guidance of experienced professional river guides.",
      "Whether you're a first-time rafter or an adrenaline enthusiast, Sagana offers an unforgettable adventure filled with teamwork, excitement, and spectacular views. Safety equipment, expert instruction, and guide support are provided throughout the trip, making it an ideal activity for individuals, families, friends, and corporate groups.",
    ],
    heroImageUrl: '/images/saganawaterrafting2.jpeg',
    heroImageWidth: 1496,
    heroImageHeight: 1000,
    gallery: [
      {
        src: '/images/saganawaterrafting1.jpeg',
        alt: 'Two rafters in helmets and life jackets in the Tana River rapids',
        width: 1496,
        height: 1000,
      },
      {
        src: '/images/saganawaterrafting3.jpeg',
        alt: 'A rafting group preparing gear on the riverbank before setting off',
        width: 1496,
        height: 1000,
      },
    ],
    isFeatured: true,
  },
  {
    slug: 'mount-kenya-national-park',
    name: 'Mount Kenya National Park',
    region: 'Central Kenya',
    description:
      'Africa’s second-highest peak, a UNESCO World Heritage Site with glacial valleys, alpine lakes, and multiple summit routes.',
    details: [
      "Africa's second-highest peak after Kilimanjaro, Mount Kenya is an extinct volcano whose jagged twin summits, Batian and Nelion, are technical climbs reserved for experienced mountaineers — but its third peak, Point Lenana (4,985m), is a demanding trek reachable without technical climbing gear over three to five days. Along the way, routes pass through forest, bamboo, and heather zones before opening onto a surreal alpine world of giant lobelias, groundsel, glacial tarns, and — for now — the last remaining equatorial glaciers in Africa.",
    ],
    // Real client photo — a clear, unobstructed shot of Batian/Nelion's jagged,
    // snow-streaked summit rising above the forest line.
    heroImageUrl: '/images/mtkenya1.jpeg',
    heroImageWidth: 678,
    heroImageHeight: 452,
    gallery: [
      {
        src: '/images/mtkenya2.jpeg',
        alt: 'A near-summit view of Mount Kenya at dusk with the moon rising beside the peak',
        width: 515,
        height: 388,
      },
    ],
    tourCount: 3,
    isFeatured: true,
  },
  {
    slug: 'masai-mara-national-reserve',
    name: 'Masai Mara National Reserve',
    region: 'Narok County',
    description:
      'Kenya’s most iconic reserve, stage for the annual wildebeest migration and year-round Big Five sightings.',
    details: [
      "The Mara is the Kenyan half of the wider Serengeti ecosystem, and its open grassland is the stage for the Great Migration each year, when over a million wildebeest and hundreds of thousands of zebra cross from Tanzania in search of fresh grazing, running a gauntlet of Nile crocodiles at the Mara and Talek river crossings, usually between July and October. Even outside migration season, the Mara holds some of Africa's highest predator densities — resident lion prides, cheetah, leopard, and spotted hyena — alongside all of the Big Five.",
      "The Mara Triangle and the private conservancies bordering the main reserve — Mara North, Naboisho, and Olare Motorogi among them — offer lower vehicle density and off-road game drives that aren't permitted inside the reserve itself, for a quieter, more flexible safari. A sunrise hot air balloon safari over the plains, landing to a champagne bush breakfast, is one of Kenya's most popular add-on experiences and a spectacular way to see the migration herds from above.",
      "The reserve takes its name from the Maasai people, who have grazed cattle across this landscape for generations and still live in and around it today. A visit to a Maasai manyatta (homestead) — with traditional beadwork, song, and the athletic adumu jumping dance — is a genuine, widely available add-on to a Mara safari and one of Kenya's best-known cultural experiences (see our Cultural Tours). The Mara is roughly a 45-minute scheduled flight from Nairobi, or a five- to six-hour drive via Narok, and rewards a visit either during the July–October migration or the drier, quieter January–February season.",
    ],
    heroImageUrl:
      'https://www.greenbarbetadventures.com/wp-content/uploads/2024/02/Mara-6-1024x577.webp',
    heroImageWidth: 1024,
    heroImageHeight: 577,
    tourCount: 3,
    isFeatured: true,
  },
  {
    slug: 'amboseli-national-park',
    name: 'Amboseli National Park',
    region: 'Southern Kenya',
    description:
      'Open plains beneath Mount Kilimanjaro, known for large free-ranging elephant herds.',
    details: [
      "Amboseli's dried Pleistocene lake bed and swamps, fed by underground rivers off Kilimanjaro, draw some of Africa's largest and best-studied free-ranging elephant herds — decades of research here mean some individual bulls and matriarchs are recognizable by name. On a clear morning, the park's flat plains give an almost uninterrupted view of Kilimanjaro's snow-capped summit rising across the border in Tanzania, making it one of the most photographed backdrops in East Africa.",
    ],
    heroImageUrl:
      'https://www.greenbarbetadventures.com/wp-content/uploads/2024/02/Amboseli-2-768x1023.webp',
    heroImageWidth: 768,
    heroImageHeight: 1023,
    isFeatured: true,
  },
  {
    slug: 'nairobi-national-park',
    name: 'Nairobi National Park',
    region: 'Nairobi',
    description:
      'The world’s only national park within a capital city — lion, rhino, giraffe, and buffalo sightings set against Nairobi’s skyline, a short drive from the airport.',
    details: [
      "Just a few kilometres from Nairobi's city centre and a short transfer from Jomo Kenyatta International Airport, Nairobi National Park is the only park in the world bordering a capital city skyline — game drives here regularly frame lion, rhino, giraffe, buffalo, and zebra against a backdrop of high-rises in the distance. It's an easy half- or full-day trip rather than a multi-night safari, making it a favourite for travellers with limited time: business visitors between meetings, families and couples on a layover, or anyone wanting a genuine wildlife encounter without leaving Nairobi. A typical day trip includes hotel or airport pick-up and drop-off, a guided game drive in a 4x4 safari Land Cruiser, a professional driver-guide, and bottled water along the way — perfect for families, couples, solo travellers, business visitors, and anyone with limited time in Nairobi.",
    ],
    // Real Nairobi National Park photo — a giraffe with the actual city skyline behind it,
    // the iconic shot that captures what makes this park unique. Verified before use.
    heroImageUrl: '/images/giraffe-nairobi-skyline.jpg',
    heroImageWidth: 1600,
    heroImageHeight: 1374,
    heroImageCredit: 'Alexmbogo, CC BY-SA 4.0, via Wikimedia Commons',
    isFeatured: true,
  },
  {
    slug: 'diani',
    name: 'Diani',
    region: 'Kenyan Coast',
    description:
      'White-sand beaches and coral reefs on the south coast, Kenya’s premier beach destination.',
    details: [
      "South of Mombasa on Kenya's coast, Diani's beach is a long stretch of white coral sand backed by palm groves and a barrier reef that keeps the water calm and shallow close to shore — good for swimming, snorkeling, and kitesurfing alike. It's also one of the last strongholds of the rare Zanzibar red colobus and Angolan black-and-white colobus monkeys, both found in patches of coastal forest just behind the beachfront hotels.",
    ],
    // No dedicated destination page exists on the old site for Diani (confirmed via its sitemap) —
    // using a high-res curated placeholder instead, swappable with zero layout change.
    heroImageUrl:
      'https://images.unsplash.com/photo-1677148435742-0944b14dc134?w=1024&q=75&auto=format&fit=crop',
    heroImageWidth: 1024,
    heroImageHeight: 1024,
    isFeatured: false,
  },
  {
    slug: 'mombasa',
    name: 'Mombasa',
    region: 'Kenyan Coast',
    description:
      'Kenya’s coastal hub, blending Swahili history, Old Town architecture, and Indian Ocean beaches.',
    details: [
      "Kenya's second city and its main port, Mombasa sits on an island connected to the mainland by bridges, causeways, and the Likoni ferry. Old Town's narrow streets mix Swahili, Arab, Portuguese, and British influences, still visible in the carved wooden doors and balconies around 16th-century Fort Jesus, a UNESCO World Heritage Site built by the Portuguese and fought over by Omani, British, and local forces for centuries after.",
    ],
    heroImageUrl:
      'https://www.greenbarbetadventures.com/wp-content/uploads/2026/03/mombasa-bg1-650x450.webp',
    heroImageWidth: 650,
    heroImageHeight: 450,
    tourCount: 1,
    isFeatured: true,
  },
] as const;

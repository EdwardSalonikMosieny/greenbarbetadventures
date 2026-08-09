// Typed nav configuration shared by the desktop nav and the mobile drawer.

export interface NavLink {
  label: string;
  href: string;
}

export interface TourCategory {
  label: string;
  slug: string;
}

export const PRIMARY_LINKS: readonly NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
];

// Slugs are kebab-case and independent of the backend's TourType enum naming;
// the two are mapped together once Step 6 fetches real tour data.
export const TOUR_CATEGORIES: readonly TourCategory[] = [
  { label: 'Wildlife Safaris', slug: 'wildlife-safaris' },
  { label: 'Cultural Tours', slug: 'cultural-tours' },
  { label: 'Luxury Tours', slug: 'luxury-tours' },
  { label: 'Mountain Climbing & Hikes', slug: 'mountain-climbing-hikes' },
  { label: 'Camping', slug: 'camping' },
  { label: 'Birding', slug: 'birding' },
];

export const SECONDARY_LINKS: readonly NavLink[] = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Activities', href: '/activities' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export const CONTACT_INFO = {
  phones: ['+254 721 379 112', '+254 795 610 847'],
  email: 'info@greenbarbetadventures.com',
  address: 'Near Naromoru River Lodge, Naromoru, Kenya',
} as const;

export interface SocialLink {
  label: 'Instagram' | 'YouTube' | 'TikTok';
  href: string;
}

// Real, confirmed accounts (supplied by the client). Facebook/LinkedIn/X previously
// appeared here as unconfirmed guessed handles — removed rather than kept as
// placeholders now that we have the owner's actual profiles instead.
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/greenbarbetadventures' },
  { label: 'YouTube', href: 'https://youtube.com/@barbet2023' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@greenbarbetadventures' },
] as const;

export const LEGAL_LINKS: readonly NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
] as const;

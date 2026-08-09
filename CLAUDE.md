# Green Barbet Adventures — Website Rebuild

## Role & standards
You are acting as a senior full-stack engineer and UI/UX designer with deep experience building premium, conversion-focused travel and hospitality websites. Write production-grade, clean, well-commented TypeScript. Default to accessible, performant, mobile-first design. Never add placeholder/demo content — use the real content below, or clearly-marked realistic seed data relevant to Kenyan tourism. Never generic template filler.

## Project context
Rebuilding the website for **Green Barbet Adventures**, a Kenya-based tours and travel company, replacing their current site (greenbarbetadventures.com), which is an **unmodified WordPress "Triprex" demo theme** actively hurting the brand. Specific problems to not repeat:
- Leftover demo content unrelated to Kenya (ski touring, surfing, "hotels in Japan/London/Singapore," visa services for "Argentina/Bangladesh").
- Dead `#` links for Privacy Policy / Terms & Conditions.
- Generic, un-branded social links (`facebook.com/`, `twitter.com/` with no handle).
- A fake-looking "5.0/5.0" TripAdvisor badge linking to TripAdvisor's homepage, not a real review page.
- Inconsistent phone numbers across sections.
- Cluttered search widgets for services they don't offer, copy-pasted from the template.
- A static, flat hero banner with no real motion design.
- No content management — the owner cannot update anything without a developer.

The new site must feel like a completely different, premium, trustworthy, modern travel brand. Every section should implicitly answer "why is this so much better than before?"

## Company / content reference (real — use this, not invented content)
- Company: Green Barbet Adventures Ltd
- Tagline: "Dream, Explore, Discover"
- Location: Near Naromoru River Lodge, Naromoru, Kenya
- Contact: +254 721 379 112 · +254 795 610 847 · info@greenbarbetadventures.com
- Positioning: "Explore Kenya like never before" — every destination leaves a unique memory; serves both romantic honeymoon travelers and families.
- Trust stat: 600+ customers served.

Core Tour Types / Services (primary nav-level service categories):
1. Wildlife Safaris
2. Cultural Tours
3. Luxury Tours
4. Mountain Climbing & Hikes (e.g. Mount Kenya)

Real destinations (only use these — no invented international destinations): Samburu National Reserve, Lake Nakuru National Park, Lol Daiga Conservancy, Aberdares National Park, Ol Pejeta Conservancy, Solio Game Reserve, Mount Kenya National Park, Masai Mara National Reserve, Amboseli National Park, Diani (coast/beach), Mombasa.

Sample real tour packages (realistic seed data, USD per person, taxes included):
| Package | Duration | Price |
|---|---|---|
| 3-Day Mombasa Holiday Package | 3 Days / 2 Nights | $500 |
| 3-Day Samburu Wildlife Safari | 3 Days / 2 Nights | $720 |
| 3-Day Aberdare Wilderness Safari | 3 Days / 2 Nights | $700 |
| 3-Day Masai Mara Wildebeest Migration Safari | 3 Days / 2 Nights | $730 |
| 7-Day Best of Kenya Classic Bush Safari | 7 Days / 6 Nights | $460 (was $670 — sale-price UI pattern) |
| 8-Day Aberdares National Park & Mount Kenya Summit | 8 Days / 7 Nights | $480 (was $650) |

**Pricing display policy (owner directive, overrides the "sale-price UI pattern" note above):** tour package prices are **not shown publicly** anywhere on the customer-facing site — no price, no strikethrough/sale price, on cards, detail pages, or anywhere else customers browse. Prices stay in the data model (Prisma `Tour.priceUsd`/`discountPriceUsd`, the frontend `Tour` type) for internal/admin use (Step 15 dashboard, invoicing) and are only ever surfaced to the owner, never to a site visitor. Customers see duration, destination, description, and itinerary, then a "View Itinerary" / "Book Now" / "Enquire" path that leads to the booking inquiry form (Step 12) — pricing is handled off-site by the owner, not published.

Payment methods to display: Visa, Mastercard, PayPal.
Social platforms to link (real placeholders, structured properly — no dead `#` links): Facebook, Instagram, LinkedIn, X/Twitter.
Real photography will be supplied later — for now use clearly-labeled, high-quality royalty-free placeholder images, sized/cropped correctly so swapping in real photos later requires zero layout changes.

## Tech stack (hard requirements)
Repository structure — monorepo, two fully independent top-level folders, never mix frontend/backend code:
```
/green-barbet-adventures
  /frontend
  /backend
  /CLAUDE.md
  /README.md
```

Frontend:
- React + TypeScript via Vite (not CRA).
- Styling: CSS Modules (`*.module.css`) per component + a global `variables.css` design-token file (colors, spacing, typography, shadows, radii, breakpoints). No inline styles except computed values.
- Animation: Framer Motion for scroll-triggered reveals, staggered text, page transitions.
- Routing: React Router v6+.
- Data fetching: small typed API client (fetch or Axios), typed request/response interfaces.
- Forms: React Hook Form + Zod validation.
- Images: lazy loading, responsive `srcset`, an `OptimizedImage` wrapper component.
- State: React Context + hooks — no Redux for a site this size.

Backend:
- Node.js + Express + TypeScript end-to-end (one language across the stack, full type-safety DB→UI).
- ORM: Prisma targeting PostgreSQL.
- Auth: JWT-based admin authentication, bcrypt password hashing. Single ADMIN role is enough for v1.
- Validation: Zod on every incoming request body.
- File/image uploads: multer, local `/backend/uploads` in dev with a documented path to swap to S3/Cloudinary in production.
- API style: REST, versioned under `/api/v1/...`.
- Security: helmet, cors scoped to the frontend origin only, express-rate-limit on auth routes, input sanitization.

Database (PostgreSQL via Prisma) — minimum schema:
- Admin (id, email, passwordHash, name, createdAt)
- Destination (id, name, slug, description, heroImageUrl, region, createdAt, updatedAt)
- Tour (id, title, slug, description, itinerary [JSON or related day-by-day table], durationDays, durationNights, priceUsd, discountPriceUsd nullable, tourType enum [WILDLIFE_SAFARI, CULTURAL, LUXURY, MOUNTAIN_CLIMBING], destinationId FK, coverImageUrl, galleryImages relation, isFeatured boolean, isPublished boolean, createdAt, updatedAt)
- Activity (id, title, description, imageUrl) — only real, Kenya-relevant activities; confirm with me before adding any not already listed here
- Experience/Story (id, title, slug, coverImageUrl, body, publishedAt) — this is what "post new experiences" means: admin publishes trip stories with photos, not just static tours
- Testimonial (id, customerName, customerPhotoUrl nullable, rating, quote, tourId nullable FK)
- BookingInquiry (id, name, email, phone, tourId nullable, preferredDates, numberOfTravelers, message, status enum [NEW, CONTACTED, CONFIRMED, CLOSED], createdAt)
- NewsletterSubscriber (id, email, subscribedAt)

Generate the actual `schema.prisma`, a seed script (`prisma/seed.ts`) populated with the real content above, and document migration commands in the backend README.

## UI/UX direction
- Visual identity: warm, premium "African safari meets modern travel-tech" — deep forest green + warm terracotta/burnt orange + soft cream/off-white + a single gold/amber CTA accent. Avoid generic blue-and-white "corporate SaaS" travel templates.
- Typography: confident serif or high-contrast display font for headlines (editorial travel-magazine feel) + a clean, highly legible sans-serif for body text. Define as `--font-display` / `--font-body` in the CSS variables file.
- Imagery-led: large full-bleed photography, generous whitespace, no cramped template feel.
- Micro-interactions: hover states on cards (subtle scale + shadow lift), animated nav-link underlines, button press feedback, smooth anchor scrolling.
- Motion: cinematic but fast — respect prefers-reduced-motion, keep animations under ~600ms.
- Accessibility: semantic HTML, correct heading hierarchy, alt text everywhere, visible focus states, WCAG AA contrast, full keyboard navigation.
- Performance: Lighthouse 90+ on Performance/Accessibility/Best Practices/SEO. Code-split routes, compress/lazy-load images, avoid layout shift.
- Responsive: mobile-first; verify at 375px, 768px, 1024px, 1440px.
- SEO: per-route title/meta description, Open Graph tags, semantic structure, sitemap.xml, robots.txt.

## Hero section — animation spec
Reference: `@elyptwebdesign` on TikTok — portfolio reels reviewed showing oversized confident typography as visual anchor, tight 2-3 color palettes, full-bleed photography with clean overlays, minimal nav chrome. Confirmed direction: warm & earthy palette, text-first entrance.

Full-viewport-height hero, layered behaviors:
1. Palette: warm & earthy — deep forest green + terracotta/burnt-orange accent + soft cream, per the site-wide design tokens.
2. Sequence — text first, then photo:
   - Step A (0–~0.9s): oversized headline (≈6–9rem desktop, display font, deep green/near-black on cream) animates in first — split into words/lines, staggered with Framer Motion staggerChildren, each fading up (opacity 0→1, y: 24px→0). No photo yet, or a soft placeholder/blur.
   - Step B (~0.9–1.6s): hero photograph reveals — clip-path/mask wipe or scale-up-from-90%-to-100%, landscape/wildlife image sliding or fading into frame. Confirm exact layout (behind text / beside / panel) once built — pick the cleanest option and check in before finalizing.
   - Step C (~1.6–1.9s): subtext + CTA fade in last; total sequence under ~2s.
3. Mouse-driven micro-interaction: subtle 3D tilt/parallax on hover over the hero photo (onMouseMove + Framer Motion useMotionValue/useTransform), capped to 2–6° rotation.
4. CTA button: minimal solid-fill (terracotta/gold accent) or outline — no gradients/glow.
5. Scroll-cue: small minimal line/chevron bottom-center, fades out past ~50px scroll.
6. Scroll parallax: background photo moves slower than foreground content leaving the hero (useScroll + useTransform, no scroll-jacking).
7. Rotating taglines (recommended): cycle 3–4 lines from real positioning copy ("Journey Into the Heart of Kenya," "Explore Nature's Hidden Treasures," "Discover the World Through Its Traditions," "Relax & Unwind on Paradise Shores") every ~4s, quick crossfade.
8. Trust row under the CTA: "600+ happy travelers," a real star rating linking to an actual on-page reviews section — not TripAdvisor's homepage like the old site.

Tone check: if it starts looking busy or stacks too many effects, pull back. Confidence and restraint — big type, tight palette, one well-executed sequence — over piling on effects.

## General rules for every task
- TypeScript with proper interfaces/types — no `any` unless unavoidable, and comment why.
- Every component responsive and accessible by default, not retrofitted.
- Comment non-obvious logic; don't over-comment trivial code.
- Real Kenya-specific content only for anything customer-facing — no Lorem Ipsum except throwaway internal test fixtures.
- Flag assumptions explicitly rather than silently guessing.
- Ask before deciding anything structural (schema, auth approach, routing) if ambiguous. Use best judgment for purely cosmetic micro-decisions, and note the choice made.

## Build process
We're building this strictly one section at a time, in the sequence below. Do not scaffold later sections in advance. Do not generate more than the current step in a single pass.

For each step:
1. Enter plan mode and outline exactly what you'll build for that step (files to create/edit, key decisions, any assumptions you're making).
2. Wait for explicit go-ahead before writing any code.
3. Once approved, build it, and use the todo list tool to track sub-tasks within the step so progress is visible.
4. When the step is done, give a short summary of what was built and why, then stop and wait for review before starting the next step. Don't ask "should I continue?" and then continue anyway — actually stop.

Build sequence:
1. Project scaffolding — initialize /frontend (Vite + React + TS) and /backend (Express + TS + Prisma) with folder structure, linting (ESLint + Prettier), .env.example files, and a root README explaining how to run both. No UI yet.
2. Design tokens & global styles — variables.css, typography setup, reset/base styles, shared layout primitives (Container, Section wrapper).
3. Navigation bar — logo, links (Home, About, Tours ▾ [Wildlife Safaris, Cultural Tours, Luxury Tours, Mountain Climbing/Hikes], Destinations, Activities, Contact), phone/email quick-contact strip, "Book Now" CTA, mobile hamburger menu with animated slide-in drawer, sticky-on-scroll with subtle background/shadow change. Include an Admin Login entry point (small footer link or /admin/login route — not prominent in the main nav).
4. Hero section — per the spec above.
5. Destinations showcase — grid/carousel of the real destinations, image-led cards with name + tour count, linking to a destination detail route.
6. Tour packages section — cards for the real sample tours (duration badge, destination tag, "View Itinerary" CTA). No prices displayed publicly — see the pricing display policy above.
7. About / Mission & Vision — company story, the 600+ customers stat as an animated counter, mission/vision copy.
8. Services deep-dive — the four core services, each with its own description and image.
9. Activities section — real, confirmed Kenya-relevant activities only. Ask to confirm the list before building if unsure.
10. Testimonials — real-feeling review cards with rating, on-page (not linking out to a fake TripAdvisor homepage).
11. Newsletter signup — functional form hitting a real backend endpoint.
12. Contact / Booking inquiry form — full form (name, email, phone, tour interest, preferred dates, travelers, message) posting to the BookingInquiry endpoint, with success/error states and validation.
13. Footer — consistent correct contact info, real working internal links, working Privacy Policy/Terms pages, correctly-labeled social links, payment method icons.
14. Admin authentication — /admin/login, JWT flow, protected route wrapper on frontend, protected middleware on backend.
15. Admin dashboard — CRUD UI for Tours, Destinations, Activities, and Experiences/Stories (create/edit/delete, image upload for cover + gallery), a table view of Booking Inquiries and Newsletter Subscribers (read + status update), basic dashboard stats.
16. Polish pass — cross-browser check, responsive QA at all breakpoints, accessibility pass, Lighthouse audit and fixes, loading states/skeletons, error boundaries, 404 page.
17. Deployment notes — environment variables needed, suggested hosting (e.g. frontend on Vercel/Netlify, backend on Render/Railway, Postgres on Railway/Supabase/Neon), production build checklist.

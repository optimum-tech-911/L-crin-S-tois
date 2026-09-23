# Sète Location - Direct Booking Website

This is the frontend implementation for an independent direct-booking website for a holiday apartment in Sète, France.

## Architecture

Built with:
- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router (for SPA navigation)
- React Helmet Async (for SEO)

The architecture is explicitly designed to be extensible:
- **`src/data/`**: Centralized place for all property facts, pricing, site config, and mocked reviews.
- **`src/services/`**: Abstractions for `BookingService` and `CalendarService`. Currently mocked, these will connect to a real backend (e.g. Supabase, Stripe, Airbnb iCal) in Phase 2.
- **`src/components/`**: Reusable components split by domain (booking, layout, seo, common).
- **`src/pages/`**: View-level route components.

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Production Build

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Placeholders checklist before go-live

You MUST replace the placeholders before deploying the final production version:

- [ ] `src/data/site.ts`: Update domain (`url`), email, phone.
- [ ] `src/data/property.ts`: Fill in actual property name, stats, address, and real amenities.
- [ ] `src/data/pricing.ts`: Fill in real prices and taxes.
- [ ] `src/data/reviews.ts`: Add real reviews (if any).
- [ ] `src/services/bookingService.ts`: Implement real booking logic + payment (Stripe).
- [ ] `src/services/calendarService.ts`: Implement real iCal or DB fetching.
- [ ] `public/sitemap.xml`: Update with final domain.
- [ ] `public/robots.txt`: Update with final domain.
- [ ] Replace `ImagePlaceholder` instances across all pages with real optimized photography (WebP/AVIF).
- [ ] Fill in `Legal.tsx` contents with actual legal wording.
- [ ] Set up Google Search Console verification in `index.html`.

# Double Touch Show — Landing Page

Professional landing page for the Double Touch Show dance collective from Zlotnikov Dance Center. Premium dark design with soft parallax, smooth animations, and Russian content.

## Features

- **DT Noir Design System** — Carefully crafted dark palette with purple and teal accents
- **Soft Parallax** — Subtle background effects (max 60px offset, no glow)
- **Smooth Animations** — Reveal effects on scroll, hover transitions (200–300ms)
- **Responsive Design** — Mobile-first (360px → 1440px+)
- **SEO-Ready** — Semantic HTML, OpenGraph tags, proper meta descriptions
- **Performance** — Lazy-loaded images, optimized bundle size
- **Modern Stack** — React 18 + Vite + Tailwind CSS + TypeScript

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

## DT Noir Color System

| Element | Hex | Purpose |
|---------|-----|---------|
| Background | #0D0E10 | Main bg |
| Surface | #121318 | Cards, sections |
| Text | #E6E7EB | Primary text |
| Muted | #A5A7B1 | Secondary text |
| Lines | #272932 | Borders, dividers |
| Accent | #7D5CFA | Primary action, headings |
| Accent2 | #0FD2C8 | Secondary accents, icons |
| CTA | #6E56CF | Button background |

## Content Management

All copy, links, and configuration live in a single file:

**`src/content/doubleTouch.ru.ts`**

Update this file to change:

- Hero section (title, subtitle, tags, CTA labels)
- About paragraph
- Services (brands & private events)
- Style description
- Experience projects
- Media/PR statistics
- Why us (6 reasons)
- Quote
- Contact info (phone, social, email, address, map)

### Example: Update Contact Links

```typescript
// src/content/doubleTouch.ru.ts
contacts: {
  phone: '+998 99 365 44 32',
  telegram: 'doubletouchshow1',          // Username only
  telegramUrl: 'https://t.me/...',
  instagram: 'doubletouchshow',
  instagramUrl: 'https://instagram.com/...',
  email: 'doubletouchshow1@gmail.com',
  address: 'Zlotnikov Dance Center, Ташкент',
  mapEmbed: '{{MAP_EMBED}}',             // Replace with iframe URL
}
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Sticky nav, mobile menu
│   ├── Hero.tsx            # Hero with soft parallax
│   ├── About.tsx           # About section
│   ├── Services.tsx        # Services (2-column cards)
│   ├── StyleBlock.tsx      # Style description
│   ├── Experience.tsx      # Project cards (2-col)
│   ├── MediaPR.tsx         # Media stats
│   ├── Why.tsx             # Why choose us (3-col)
│   ├── Quote.tsx           # Centered quote
│   ├── MediaGrid.tsx       # Photo gallery + lightbox
│   ├── Contacts.tsx        # Contact info + form
│   ├── ContactForm.tsx     # Form component
│   └── Footer.tsx          # Footer
├── content/
│   └── doubleTouch.ru.ts   # All content & config
├── contexts/               # (Legacy)
├── App.tsx
├── main.tsx
└── index.css               # Tailwind + utilities
```

## Component Highlights

### Header
- Sticky with backdrop blur
- Responsive mobile menu
- Smooth scroll navigation

### Hero
- Soft parallax (0.3× multiplier)
- Radial gradient blobs (subtle, detuned)
- Kicker + large title + tags + dual CTA

### Sections
- **About** — 2-paragraph intro
- **Services** — 2 cards (brands, private events)
- **Style** — Description card
- **Experience** — 6 project cards in 2-col grid
- **MediaPR** — 4 stat cards
- **Why** — 6 reason cards in 3-col grid
- **Quote** — Centered blockquote

### MediaGrid
- Photo gallery with lazy loading
- Lightbox on click
- Responsive grid (1–3 cols)

### Contacts
- Address, phone, email with icons
- Social media buttons (Telegram, Instagram, Call, Email)
- Contact form (name, phone/messenger, message)
- Map placeholder

## Utilities & Components

### Tailwind Classes

- `.section` — Padding (py-20 lg:py-32)
- `.container-dt` — Centered container + gutters
- `.btn` — Base button styles
- `.btn-primary` — CTA button (purple, hover: darker)
- `.btn-secondary` — Outline button
- `.card` — Card component (border, rounded)
- `.card-hover` — Card with hover effects
- `.chip` — Badge/tag
- `.chip-accent` — Colored chip
- `.h-divider` — Horizontal line with gradient
- `.link-accent` — Accent-colored link

### Animations

- `.reveal` — Fade + slide-up (600ms, 0.6s ease-out)
- `.reveal-delay-1/2/3` — Staggered (40–120ms)
- Smooth transitions (200–300ms) on all interactive elements

## Contact Form

Form posts to `/api/contact` by default. To integrate:

**Option 1: Backend Endpoint**
```typescript
// src/components/ContactForm.tsx, line 22
const response = await fetch('/api/contact', {
  // Replace with your endpoint
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

**Option 2: Supabase Edge Function**
```typescript
await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});
```

## SEO & OG

Updated meta tags:

- **Title** — "Double Touch Show — танцевальные шоу, промо и события"
- **Description** — "Профессиональный танцевальный коллектив: корпоративные события, промо, шоу..."
- **OG Image** — `/og-doubletouch.jpg` (1200×630)
- **Theme Color** — #0D0E10

## Before Deployment

1. **Images**
   - Add `/public/og-doubletouch.jpg` (1200×630)
   - Add media to `/public/assets/media/`
   - Update `MediaGrid.tsx` with actual image paths

2. **Links**
   - Replace `{{MAP_EMBED}}` in `doubleTouch.ru.ts` with Google Maps/Yandex iframe
   - Verify Telegram, Instagram, email links in `DT.contacts`

3. **Form Endpoint**
   - Update `/api/contact` to your backend or serverless function

4. **Branding**
   - Update favicon in `/public/favicon.svg` if needed
   - Adjust colors in `tailwind.config.js` (dt-* palette)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

- Vite optimized build (~170KB JS, ~22KB CSS gzipped)
- Lazy-loaded images with srcset
- Minimal dependencies (React, Lucide icons, Tailwind)
- 60fps animations on modern devices

## License

© 2025 Zlotnikov Dance Center × Double Touch Show

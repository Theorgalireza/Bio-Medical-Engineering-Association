# انجمن علمی مهندسی پزشکی — گرایش بیوالکتریک

Next.js 14 (App Router) + React + TypeScript + Tailwind CSS + Framer Motion.
Fully Persian, fully RTL, dark-blue/neon "NeuroTech Lab" identity.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project structure

```
app/
  layout.tsx        RTL/Farsi shell, font loading, metadata
  page.tsx           Assembles all sections
  globals.css         Base styles, RTL rules, reusable component classes
components/
  Navbar.tsx           Sticky nav, scroll-aware bg, mobile overlay menu
  Hero.tsx             Logo + circuit + waveform hero
  SignalSpine.tsx       Signature scroll-linked ECG rail (desktop only)
  AnnouncementsSection.tsx
  PublicationsSection.tsx
  FacultySection.tsx
  FeedbackSection.tsx   Local useState form + waveform rating
  ContactSection.tsx    Validated contact form
  Footer.tsx
  ui/
    NeuroLogo.tsx        Rotating circuit ring + brain + EEG monogram
    PublicationCover.tsx Generated cover art per publication
    Waveform.tsx          Small reusable ECG icon
    WaveformRating.tsx     ECG-icon rating control (replaces stars)
    SectionHeading.tsx     Eyebrow + title + lede, fade/slide on scroll
lib/
  types.ts    Announcement / Publication / FacultyMember / Feedback interfaces
  mockData.ts  Farsi sample content for every section
```

## Design system (tokens)

| Token | Hex | Use |
|---|---|---|
| `surface` | `#020617` | page background (darkest layer) |
| `primary` | `#0f172a` | section backgrounds, gradients |
| `primaryLight` | `#1e293b` | card / panel backgrounds |
| `accent` | `#22d3ee` | primary interactive color (CTAs, active nodes) |
| `electric` | `#38bdf8` | secondary accent, links, contact section |
| `signal` | `#818cf8` | waveform / EEG-ECG line color |
| `neonGreen` | `#4ade80` | live/status indicators |
| `neonPurple` | `#a855f7` | tertiary accent, faculty variety |
| `borderSoft` | `#1f2937` | hairline borders |

**Type:** Vazirmatn (display + body, geometric/technical Persian face) paired
with IBM Plex Mono for "instrument readout" data — dates, issue numbers,
eyebrow labels — anything meant to feel like it came off a lab display.

**Signature element:** the `SignalSpine` — a single ECG-styled line that runs
the full height of the page on desktop, filling with a glowing gradient as
the visitor scrolls, with six pulsing nodes matching the six nav sections.
It turns scroll position into a literal biosignal readout and is the one
thing that ties Hero → Announcements → Publications → Faculty → Feedback →
Contact into a single instrument rather than six independent blocks.

## Where things intentionally diverge from generic templates

- No stat blocks or numbered "01/02/03" markers in the hero — the brief's
  content isn't a sequence, so none were forced in.
- Faculty avatars are monogram circles tinted per person (`signalTint`) as a
  legitimate placeholder, not a mystery-meat stock photo.
- Publication "covers" are generated SVG compositions (waveform + silhouette
  + issue tag) rather than a flat placeholder square — swap in
  `PublicationCover.tsx` once real cover art exists.

## Accessibility notes

- All interactive controls (rating, hamburger, form fields) have visible
  `focus-visible` rings in `accent`/`electric` and correct `aria-*` attributes.
- `prefers-reduced-motion` is respected globally in `globals.css` — every
  animation collapses to near-instant for users who request it.
- Color contrast: body text uses `ink`/`inkMuted` against `surface`/`primary`,
  both comfortably above WCAG AA for their font sizes; verify again once real
  photography is added behind text.
- Decorative SVGs (waveforms, circuit lines, the signal spine) are marked
  `aria-hidden="true"` so screen readers skip straight to real content.

## Performance tips

- `next/font/google` self-hosts and subsets Vazirmatn/IBM Plex Mono at build
  time — no external font request, no layout shift.
- Framer Motion's `whileInView` + `viewport={{ once: true }}` is used
  throughout so entrance animations run once, not on every scroll pass.
- Publication covers and the hero logo are inline SVG (no image requests);
  when real photography is added, use `next/image` with explicit
  width/height to preserve CLS.
- The `SignalSpine` uses `useScroll` (a single passive scroll listener via
  Framer Motion) rather than a manual scroll handler per component.

## Design consistency notes

- Every card in the site shares the same anatomy: `card-surface` background,
  `neon-border` hover behavior, a `Waveform` or generated cover as the visual
  anchor, and `font-mono` for any numeric/date metadata. New sections should
  reuse these three primitives rather than inventing new card chrome.
- Color is used semantically, not decoratively: `accent` = primary action,
  `electric` = secondary/contact, `neonGreen` = live/status, `neonPurple` =
  faculty variety. Keep new UI within this mapping.

## Extending into a full platform

1. **Auth + real data**: swap `lib/mockData.ts` for a CMS or database (e.g.
   Supabase/Postgres) behind the same TypeScript interfaces in `lib/types.ts`
   — components don't need to change if the shapes stay stable.
2. **Member accounts**: the "عضویت در انجمن" CTA is a natural entry point for
   a member registration flow (project submissions, event RSVPs, a personal
   dashboard of joined workshops).
3. **Student projects gallery**: reuse the `PublicationsSection` card pattern
   for a "پروژه‌های دانشجویی" grid, with `PublicationCover`-style generated
   art per project until real thumbnails exist.
4. **Real feedback backend**: `FeedbackSection` and `ContactSection` are
   already shaped as controlled forms with validation — point their submit
   handlers at an API route (`app/api/feedback/route.ts`) instead of local
   `useState` when ready.
5. **Jalali dates**: mock dates are hard-coded strings; introduce a Jalali
   date library (e.g. `dayjs` with a Jalali plugin) once content is dynamic.

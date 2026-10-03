# Ebahi Tayo-Ogunleye — personal website

The umbrella site for one person with several expressions: music ministry,
SilentShout, teaching, books, Edwoltz Hair City and speaking.

Built with **Next.js 15 (App Router)**, **React 18**, **Tailwind CSS v4** and
**Motion**.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run images   # re-process assets/images → public/images
```

---

## How the project is organised

```
src/
  app/          routes only — each page composes sections, holds no content
  components/
    ui/         primitives (Section, Figure, ActionLink, Reveal, Marquee…)
    sections/   composed blocks (Hero, ExpressionIndex, ProgrammeList…)
    layout/     header, mobile nav, footer
    forms/      field primitives + the two forms
  content/      ALL copy and data, typed against content/types.ts
  lib/          class helper, image helpers, form transport
  styles/       globals.css — the brand token layer
scripts/        image pipeline
```

### The rule that keeps it maintainable

**Components never contain copy.** Everything Ebahi says lives in `src/content`.
Adding a book, a programme, a release or a nav item is a data edit. Redesign is
only needed when the *shape* of the content changes, not its contents.

Components depend on the interfaces in `src/content/types.ts`, never on the
concrete data modules — so any `Expression` renders in any expression slot, and
any `Action` works in any button.

---

## Brands without brand soup

The personal brand is purple + gold. SilentShout is royal blue + burnt orange.
Edwoltz is black, deep brown and orange-gold. They are never mixed on screen.

This is handled with **semantic CSS variables** defined in
`src/styles/globals.css`:

```css
[data-brand="silentshout"] { --c-deep: #11265f; --c-accent: #c4551f; … }
```

Any element can adopt a brand:

```tsx
<Section brand="silentshout">…</Section>
<div data-brand="edwoltz">…</div>
```

Every component styles itself with semantic tokens (`bg-deep`, `text-accent`,
`border-line`) so it adapts automatically. **No component knows which brands
exist** — adding a fourth means adding one CSS block.

---

## Images

Source photography lives in `assets/images` (not served). Running:

```bash
npm run images
```

resizes each photo to a web-sized `.webp` in `public/images` and regenerates
`src/lib/image-blur.ts` with an inline blur placeholder for every image, so
photos fade in instead of popping in.

Filenames become the `Media.src` keys used in content:

```ts
media: { src: "portrait-open-hands", alt: "…", focus: "50% 20%" }
```

Name new source files semantically, or add them to `RENAMES` in
`scripts/optimize-images.mjs`.

`focus` is a CSS `object-position` — use it to art-direct tight crops.

---

## Forms

Both forms post to `POST /api/enquiry` through `src/lib/submit.ts`.

To deliver submissions somewhere real, set:

```bash
ENQUIRY_WEBHOOK_URL=https://…      # Zapier, Make, Resend proxy, CRM, Formspree
ENQUIRY_WEBHOOK_TOKEN=…            # optional bearer token
```

Without them, submissions are validated and logged to the server console, so
nothing breaks in development. The route validates per intent, checks the email
format and drops honeypot submissions.

Separate public inboxes (music / speaking / Edwoltz) are configured in
`src/content/site.ts` under `enquiryRoutes`.

---

## Things to fill in before launch

`src/content/site.ts` carries placeholders that must be replaced with real
details:

- `phone`, `whatsapp`, `email` and the three `enquiryRoutes` addresses
- `url` (used by metadata, sitemap and structured data)
- the social profile URLs in `socials`

Also pending real assets:

- Book covers — `BookShelf` currently renders typographic covers
- Music/video embeds — `src/app/music/page.tsx` has marked embed slots
- Purchase links for books, in `src/content/books.ts`

---

## Built to grow

Already in place: SEO metadata per page, `sitemap.ts`, `robots.ts`, JSON-LD
Person schema, newsletter capture, responsive images, reduced-motion support and
skip-to-content.

Straightforward to add on this foundation: a journal (route and categories
exist), events with registration, courses and digital products, members-only
resources and a podcast/video archive — each is a new content module plus a
route that reuses the existing sections.

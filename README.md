# Ebahi Tayo-Ogunleye — personal website & content manager

The umbrella site for one person with several expressions: music ministry,
SilentShout, teaching, books, Edwoltz Hair City and speaking — together with
the dashboard that runs it.

Built with **Next.js 15 (App Router)**, **React 18**, **Tailwind CSS v4**,
**Motion**, **Zod** and **Sharp**.

---

## Getting started

```bash
npm install

# One-time: set up the dashboard login
npm run admin:password          # prints the values to put in .env.local
npm run db:seed                 # writes data/ from the seed corpus (safe to re-run)

npm run dev                     # http://localhost:3005
```

The dashboard is at **`/admin`**.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3005 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run images` | `assets/images` → `public/images` (.webp) + regenerate the LQIP module |
| `npm run db:seed` | Write any missing documents in `data/`; `-- --force` overwrites |
| `npm run db:pull` | Bring live edits from the Blob store back into `data/` |
| `npm run db:push` | Overwrite the Blob store with what is in `data/` |
| `npm run admin:password` | Generate `ADMIN_PASSWORD_HASH` and `AUTH_SECRET` |

There is no test runner and no linter. **`npm run typecheck` and `npm run build`
are the verification gates.**

---

## Environment

```bash
# Dashboard login — required
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=scrypt$...     # from `npm run admin:password`
AUTH_SECRET=...                    # 32 random bytes, signs the session cookie

# Where content is stored — pick one
BLOB_READ_WRITE_TOKEN=...          # Vercel Blob; required on Vercel
CMS_DATA_DIR=/var/data             # or a writable directory, on a host with a disk

# Optional
ADMIN_PASSWORD=...                 # plaintext; convenient locally, refused in production
SESSION_TTL_HOURS=12

# Enquiry delivery — without these, submissions are validated and logged
ENQUIRY_WEBHOOK_URL=https://...
ENQUIRY_WEBHOOK_TOKEN=...
```

Nothing about who may sign in is stored in the database or the repository:
rotating the password is an environment change and a restart, and a leaked copy
of `data/` grants nobody access.

---

## How it is organised

```
data/                    the content database — committed, human-readable JSON
  settings.json          site identity, socials, footer, SEO defaults
  navigation.json        the header and footer menus
  theme.json             palettes, palette modes, typeface and type scale
  media.json             the image library
  pages/<id>.json        one document per page: an ordered list of blocks
  collections/<name>.json   named lists — books, posts, programmes, tags…

src/
  app/
    page.tsx             the home page
    [...slug]/           every other page, rendered from its document
    blog/[slug]/         articles
    admin/               the dashboard
    api/                 enquiry endpoint, media serving, share cards
  components/
    blocks/              the block renderer: one component per block type
      columns/           the parts a `split` or `stack` is composed from
      types/             the block renderers themselves
    sections/            presentational lists the blocks hand data to
    ui/                  primitives (Figure, ActionLink, Reveal, RichText…)
    layout/              header, mobile nav, footer
    forms/               field primitives + the two forms
    admin/               dashboard UI: field renderer, editors, pickers
  content/
    schema.ts            the single source of truth — validators and types
    types.ts             the types, inferred from the schema
    seed/                the original copy, read once by the seed script
  lib/
    db/                  storage driver, document cache, repositories
    auth/                password hashing, session cookies, rate limiting
    admin/               the field, block, column and collection catalogues
    blocks/              presentation scales and style resolution
    og/                  the share-card renderer
    media/               upload pipeline and path resolution
  styles/globals.css     design-system structure (the token *values* come from the theme)
scripts/                 image pipeline, database seed, password tool
```

---

## The ideas that keep it maintainable

### 1. One schema, three consumers

Every field is described once, in [`src/content/schema.ts`](src/content/schema.ts).
The Zod validator, the TypeScript type and — through the catalogues in
`src/lib/admin` — the dashboard form all derive from that one description. A
field cannot exist in the validator and not the type, or in the form and not the
validator.

### 2. Pages are documents, not files

A page is an ordered list of **blocks**. Adding, reordering, hiding or retiring
a section is a dashboard action. `generateStaticParams` still pre-renders every
page, and saving revalidates the affected paths, so the public site serves
static HTML.

The block catalogue is deliberately small. Two layout blocks — `split` and
`stack` — are composed from **columns** (text, image, idea grid, statistics,
pills, numbered ledger, embeds, forms…), and a group column allows one level of
nesting. Everything else is a block with real art direction behind it: the
masthead, the page opener, the featured project, the collection renderers, the
closing banner.

### 3. Components never contain copy

Every string the site says lives in `data/`. Components depend only on the types
in [`src/content/types.ts`](src/content/types.ts), so any `Expression` renders in
any expression slot and any `Action` works in any button.

Copy can refer to the facts in Settings with `{site.email}`-style tokens, so
changing a phone number changes it everywhere rather than leaving stale copies
on three pages.

Formatted text uses a small inline grammar — `*accent italic*`, `**bold**`,
`/italic/`, `~muted~`, `[label](/href)` — which the dashboard edits as rich text
and the site renders into React elements. HTML is never stored and never
injected.

### 4. Palettes are data, never hex values in components

Components style themselves with semantic tokens only — `bg-deep`, `text-accent`,
`border-line`, `text-on-deep` — which resolve from CSS variables scoped by a
`data-brand` attribute. The token *values* are generated from `theme.json` into
the document head.

The site ships two palette modes. **Unified** (current) suppresses the sub-brand
palettes so the whole site speaks in purple type; **per-brand** restores the
royal-blue SilentShout and black-and-brown Edwoltz palettes. Every block carries
its palette either way, so switching is one setting.

Adding a palette is a dashboard action. **Never write a hex value or a stock
Tailwind colour (`bg-blue-600`) in a component.**

### 5. Type is a value, not a t-shirt size

The pages use more than twenty distinct display sizes, each tuned to its
section. A heading therefore stores a fluid style — a minimum, a rate of growth,
a maximum, leading, tracking and casing — with the site's own steps offered as
presets. The theme's global scale multiplies all of them at once.

### 6. Images go through one pipeline

Content references a basename only. Photographs added by a designer go through
`npm run images`; photographs uploaded in the dashboard get exactly the same
treatment — resized, re-encoded as WebP, given a blur placeholder — and are
served from the data store. Alt text and the focus point live with the image, so
a photo is described once and crops sensibly wherever it is placed.

### 7. Server Components by default

`"use client"` only where interaction or Motion genuinely requires it. Pages and
blocks stay server-rendered so metadata and SEO remain intact.

---

## Sharing and search

Every page advertises a composed **1200×630 share card** — the portrait, the
title and the standfirst, set in the site's own typeface and palette — rather
than a raw 4:5 photograph that every platform crops through the middle of.
Articles lead with their own banner, category, excerpt and date.

Cards are pre-rendered at build time. Pages use `/api/share/<id>` because Next
cannot place a metadata image file beneath a catch-all route; the home page and
articles use the file convention directly.

Alongside them: per-page canonical URLs, `Person` structured data for the site
and `BlogPosting` for each article, a database-driven sitemap, and a `robots.txt`
that keeps crawlers out of the dashboard.

---

## Security

- **Credentials come from the environment.** scrypt digests are preferred;
  plaintext is refused in production.
- **Sessions are signed, stateless cookies** (HMAC-SHA256 via Web Crypto, so the
  same verification runs in the edge middleware and on the server). `httpOnly`,
  `sameSite=lax`, `secure` in production.
- **Authorisation is enforced next to the work**, not only in the middleware:
  every dashboard page calls `requireSession()` and every write calls
  `assertSession()`.
- **Login is rate-limited** with a sliding window, and a wrong username costs the
  same time as a wrong password.
- **Everything written is validated** against the real schema first, so an
  invalid document can never reach the disk. Writes are atomic and serialised
  per document.
- **Link fields reject `javascript:` and `data:`**; embeds are restricted to
  YouTube, Vimeo and Spotify embed paths; uploads are re-encoded by an image
  library rather than trusted.

---

## Deployment

The dashboard has to be able to **write**. Where it writes is the one decision a
deployment makes, and it is made in a single place —
[`src/lib/db/index.ts`](src/lib/db/index.ts) — behind the `StorageDriver`
interface. Nothing above that line knows whether it is talking to a disk or to
object storage.

### On Vercel — Vercel Blob

Vercel runs the site as serverless functions with an ephemeral filesystem. No
plan changes that, so content goes to Blob instead.

1. In the Vercel dashboard: **Storage → Create → Blob**, and connect it to the
   project. That sets `BLOB_READ_WRITE_TOKEN` automatically.
2. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` and `AUTH_SECRET` in the project's
   environment variables.
3. Deploy.

**No manual upload step.** On its first request the site copies the documents
committed in `data/` into the Blob store and drops an `installed` marker, so the
site is complete from the first deploy and the store is authoritative from then
on. Saving a change in the dashboard writes to Blob and revalidates the affected
pages.

To bring edits made on the live site back under version control:

```bash
BLOB_READ_WRITE_TOKEN=... npm run db:pull
git diff data/          # review
```

`npm run db:push` goes the other way, forcing the live content back to the
repository's copy.

### On a host with a disk

Railway, Fly.io, Render with a disk add-on, or any VPS: mount a volume and point
`CMS_DATA_DIR` at it. **No code changes** — the filesystem driver is the default
whenever `BLOB_READ_WRITE_TOKEN` is absent.

### Locally

Neither variable is needed. Content is read and written straight to `data/`, and
changes show up in `git diff` as you make them.

### Anywhere else

Writing one more `StorageDriver` is the whole job — see
[`blob-storage.ts`](src/lib/db/blob-storage.ts) for a worked example at about
200 lines, most of it comments.

---

## Still to come

`data/settings.json` carries placeholders — `phone`, `whatsapp`, `email`, the
three enquiry addresses, `url`, and the social links. Also pending: book cover
artwork (the shelf renders typographic covers until then) and the music and
video embeds (the slots are marked on the music page). Purchase links are live.

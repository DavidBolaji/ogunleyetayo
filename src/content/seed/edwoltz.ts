/* Seed corpus — the site's original copy, read once by scripts/seed-db.ts
 * to build data/. The database is the source of truth at runtime; nothing
 * in the app imports this folder. Kept so a fresh environment can be
 * re-seeded from a known-good baseline. */

export const edwoltz = {
  name: "Edwoltz Hair City",
  positioning: "Beauty, hair care, education and enterprise.",
  headline: "Hair, done properly — and talked about honestly.",
  intro: [
    "Edwoltz Hair City is a hair business, not an extension of a ministry brand. It has its own customers, its own standards and its own identity.",
    "What it shares with everything else Ebahi builds is a teaching instinct: do the work well, then show people how it is done.",
  ],
  services: [
    { title: "Wig revamping", body: "Restoring, reviving and rebuilding wigs that still have life in them." },
    { title: "Hair services", body: "Installation, styling, maintenance and care for real, everyday wear." },
    { title: "Hair education", body: "Training for stylists and clients — technique, product knowledge and care." },
    { title: "YouTube education", body: "Open, free teaching on hair care, revamping and industry practice." },
  ],
  cta: {
    label: "Visit Edwoltz Hair City",
    href: "https://edwoltzhaircity.com/",
    external: true,
  },
  youtube: {
    label: "Watch on YouTube",
    href: "https://www.youtube.com/@edwoltzhaircity",
    external: true,
  },
  gallery: [
    { src: "hair-wig-stand", alt: "Ebahi beside a finished wig on a stand in the Edwoltz studio", focus: "50% 35%" },
    { src: "hair-curls-overhead", alt: "Natural curls photographed from above", focus: "50% 40%" },
    { src: "hair-pink-cape", alt: "Ebahi in a pink patchwork cape, natural hair worn out", focus: "50% 30%" },
    { src: "hair-profile-laughing", alt: "Ebahi laughing in profile, hair worn loose", focus: "50% 30%" },
  ],
  media: {
    src: "hair-city",
    alt: "Ebahi laughing, natural hair worn out, in a pink jacket",
    focus: "50% 30%",
  },
} as const;

export const environment = {
  heading: "Beauty, business & the environment",
  statement:
    "Ebahi brings together her experience as a hair professional and her environmental science background to explore conversations around hair waste, sustainability and responsible beauty practices.",
  body: [
    "The beauty industry produces a great deal of waste and talks about it very little. Synthetic hair, packaging, product containers and discarded wigs all go somewhere.",
    "With a master's in Environmental Chemistry & Pollution Control and years inside the industry, this project sits exactly where those two lives meet — practical, non-preachy conversations about what our industry leaves behind.",
  ],
  themes: [
    "Hair waste & where it goes",
    "Revamping as a sustainability practice",
    "Responsible product & packaging choices",
    "Salon practices that reduce waste",
    "Educating clients without shaming them",
  ],
  cta: {
    label: "Explore the hair & environment project",
    href: "https://www.youtube.com/@edwoltzhaircity",
    external: true,
  },
  media: { src: "garden-forest-wide", alt: "Ebahi walking through a forest", focus: "50% 45%" },
} as const;

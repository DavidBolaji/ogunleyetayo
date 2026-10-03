import type { Media } from "./types";

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
  cta: { label: "Visit Edwoltz Hair City", href: "https://www.youtube.com/@edwoltzhaircity" },
  media: {
    src: "editorial-veil-close",
    alt: "Editorial beauty portrait",
    focus: "50% 28%",
  } satisfies Media,
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
  cta: { label: "Explore the hair & environment project", href: "https://www.youtube.com/@edwoltzhaircity" },
  media: { src: "garden-forest-wide", alt: "Ebahi walking through a forest", focus: "50% 45%" } satisfies Media,
} as const;

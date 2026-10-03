import type { Action, Media, Release } from "./types";

export const musicIntro = {
  heading: "Music by Ebahi",
  opening: "Music has been part of my story for more than two decades.",
  body: [
    "It started as something I could do and became something I was asked to carry. Somewhere between the two, it stopped being about ability.",
    "What lives here is an archive in progress — releases, live recordings, videos and the projects still being written.",
  ],
} as const;

export const featuredProject = {
  title: "Emiore",
  quote: "I have not seen this kind of God before.",
  recordedNote: "Live recorded in Lagos, 2024.",
  releaseDate: "November 2, 2026",
  description:
    "A live recording born out of a season of seeing God do what only God does. Emiore is testimony before it is music — a room full of people who ran out of adequate words and sang anyway.",
  media: {
    src: "garden-swing-reach",
    alt: "Ebahi reaching upward on a garden swing",
    focus: "50% 35%",
  } satisfies Media,
  actions: [
    { label: "Listen now", href: "#listen" },
    { label: "Watch", href: "#watch" },
    { label: "Follow the journey", href: "/contact#newsletter" },
  ] satisfies readonly Action[],
} as const;

export const releases: readonly Release[] = [
  {
    title: "Emiore",
    subtitle: "Live in Lagos",
    kind: "live",
    year: "2026",
    note: "Releasing 2 November 2026",
    media: { src: "garden-seated-log", alt: "Ebahi seated outdoors" },
  },
  {
    title: "Psalms of Ebahi",
    subtitle: "Sung psalms & spontaneous worship",
    kind: "project",
    year: "Ongoing",
    note: "An ongoing companion to the written collection",
    media: { src: "portrait-prayer", alt: "Ebahi in prayer" },
  },
  {
    title: "Selected worship sessions",
    subtitle: "Harvest House Nation",
    kind: "video",
    year: "2019 — present",
    note: "Congregational worship, recorded live",
    media: { src: "worship-painterly", alt: "Ebahi worshipping" },
  },
  {
    title: "Original songs",
    subtitle: "Written across two decades",
    kind: "single",
    year: "2004 — present",
    note: "The catalogue being gathered into one archive",
    media: { src: "garden-leaning-log", alt: "Ebahi outdoors, leaning on a log" },
  },
];

export const musicArchiveNote =
  "This section will grow into a permanent archive of Ebahi's music journey — every release, video and live recording in one place.";

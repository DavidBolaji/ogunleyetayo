import type { Book } from "./types";

export const booksIntro = {
  heading: "Words I've written",
  opening:
    "Writing is where the things I teach get tested. If an idea cannot survive being written down plainly, it is not ready to be taught.",
} as const;

export const books: readonly Book[] = [
  {
    slug: "dear-worship-leader",
    title: "Dear Worship Leader",
    kind: "Book",
    description:
      "Letters to the person holding the microphone — on calling, preparation, correction, team life and the private work that makes public worship honest.",
    themes: ["Worship", "Ministry", "Formation"],
    action: { label: "Read more", href: "/contact" },
    accentIndex: 0,
  },
  {
    slug: "prayed-up",
    title: "Prayed Up",
    kind: "Book",
    description:
      "For anyone whose prayer life has become a guilty subject. A return to prayer as something sustained rather than something survived.",
    themes: ["Prayer", "Devotion", "Discipline"],
    action: { label: "Read more", href: "/contact" },
    accentIndex: 1,
  },
  {
    slug: "simple-praying-systems",
    title: "Simple Praying Systems",
    kind: "Resource",
    description:
      "Practical structures for consistent prayer — frameworks, rhythms and prompts for individuals, families and ministry teams.",
    themes: ["Prayer", "Systems", "Practice"],
    action: { label: "Download", href: "/contact" },
    accentIndex: 2,
  },
  {
    slug: "psalms-of-ebahi",
    title: "Psalms of Ebahi",
    kind: "Collection",
    description:
      "A collection of psalms written in real seasons — praise, lament, waiting and thanksgiving, kept in the language they arrived in.",
    themes: ["Psalms", "Worship", "Writing"],
    action: { label: "Read more", href: "/contact" },
    accentIndex: 3,
  },
];

export const journalCategories = [
  "Faith",
  "Music Ministry",
  "Leadership",
  "Creativity",
  "Purpose",
  "Life",
  "Entrepreneurship",
] as const;

export const journalIntro = {
  heading: "Journal",
  opening: "Notes from the work — written as it happens, not after it is tidy.",
  note: "The journal opens alongside the Emiore release. Join the letter and you will be the first to read it.",
} as const;

import type { Credential, Media, Recognition, TimelineEntry } from "./types";

export const profile = {
  heroHeadline: ["Faith.", "Creativity.", "Impact."] as const,
  heroSupport:
    "I am passionate about helping people grow deeply, create boldly and live purposefully.",
  meetHeading: "A life of music, ministry, teaching & impact",
  shortBio: [
    "Ebahi Tayo-Ogunleye is a music minister, teacher, mentor, author and creative entrepreneur whose work spans music ministry, worship leadership, education, mentoring, authorship and enterprise.",
    "She has served in music ministry since 2004 and currently serves as Music Director at Harvest House Nation, The Life Center Campus.",
    "Through her various platforms and projects, Ebahi is committed to helping people discover, steward and express what God has entrusted to them.",
  ],
  centralIdea: "From spiritual formation to earthly relevance.",
  portrait: {
    src: "portrait-open-hands",
    alt: "Ebahi Tayo-Ogunleye smiling, hands open",
    focus: "50% 20%",
  } satisfies Media,
} as const;

export const storyIntro = [
  "Every part of my work comes from the same place: a conviction that what God gives us is meant to be discovered, stewarded and then spent on people.",
  "I have spent more than two decades learning that in rooms with choirs, classrooms, salons, boardrooms and prayer closets — and the thread has never changed.",
];

export const timeline: readonly TimelineEntry[] = [
  {
    year: "Beginnings",
    title: "A house where sound mattered",
    body: "Long before music became ministry, it was language. Childhood was where the ear was trained and where the first sense of something larger than talent began to settle.",
  },
  {
    year: "2004",
    title: "Music ministry begins",
    body: "The year the calling stopped being a feeling and started being a commitment. Serving on a music team turned gift into discipline and discipline into ministry.",
  },
  {
    year: "The ministry years",
    title: "Learning to lead worship, not perform it",
    body: "Years of rehearsals, services, corrections and quiet growth — learning that the health of a worship leader off the platform determines what happens on it.",
  },
  {
    year: "Today",
    title: "Music Director, Harvest House Nation",
    body: "Serving as Music Director at The Life Center Campus, carrying responsibility for sound, for people and for the spiritual culture a music team creates.",
  },
  {
    year: "SilentShout",
    title: "Raising ministers, not just musicians",
    body: "SilentShout School of Music Ministry was born out of a gap: gifted young creatives with no framework for formation, character or responsibility.",
  },
  {
    year: "Enterprise",
    title: "Edwoltz Hair City",
    body: "A hair business built with the same instinct — serve people well, teach what you know, and take responsibility for what your industry leaves behind.",
  },
  {
    year: "Teaching & writing",
    title: "Turning experience into frameworks",
    body: "VisionCraft Academy, the Coaching Hub, The Power of 90 Days and four books — practical structures for people who want to move from intention to execution.",
  },
  {
    year: "This season",
    title: "Gathering the threads",
    body: "Music, ministry, teaching, writing and enterprise are no longer separate rooms. They are one house, and this season is about opening the doors.",
  },
];

export const recognitions: readonly Recognition[] = [
  { title: "Legendary Mums Award", source: "Mothers Haven Network", year: "2025" },
  { title: "Standard Bearer Award", source: "Recognition of ministry leadership", year: "2026" },
  { title: "Best Worker Award", source: "HCC Nation", year: "—" },
];

export const credentials: readonly Credential[] = [
  { qualification: "B.Sc. Chemistry", institution: "University of Ibadan" },
  {
    qualification: "M.Sc. Environmental Chemistry & Pollution Control",
    institution: "University of Ibadan",
  },
];

/** Portrait gallery for the About page. */
export const gallery: readonly Media[] = [
  { src: "editorial-veil-close", alt: "Editorial portrait with veiled hat and pearls" },
  { src: "garden-swing-laugh", alt: "Ebahi laughing on a garden swing" },
  { src: "portrait-burgundy-full", alt: "Ebahi in a burgundy jacket, full length" },
  { src: "editorial-veil-twirl", alt: "Ebahi turning, tulle skirt in motion" },
  { src: "portrait-prayer", alt: "Ebahi with hands clasped in prayer" },
  { src: "garden-portrait-hat", alt: "Ebahi smiling in a wide-brimmed hat" },
  { src: "editorial-monochrome", alt: "Monochrome studio portrait" },
  { src: "portrait-seated-profile", alt: "Ebahi seated in white, in profile" },
  { src: "garden-twirl", alt: "Ebahi turning in a garden" },
  { src: "editorial-veil-chest", alt: "Editorial portrait, hand at her chest" },
  { src: "garden-trees", alt: "Ebahi among the trees" },
];

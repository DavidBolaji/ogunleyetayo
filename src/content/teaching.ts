import type { Programme } from "./types";

export const teachingIntro = {
  heading: "Learn with Ebahi",
  opening: "I teach because information becomes powerful when it produces transformation.",
  body: [
    "Most people do not need more ideas. They need a structure that turns the ideas they already have into something that actually happens.",
    "That is what this work is for — frameworks, accountability and teaching that end in execution.",
  ],
} as const;

export const powerOf90 = {
  name: "The Power of 90 Days",
  promise: "A teaching framework around vision, strategy and execution.",
  body: [
    "A year is too long to stay accountable to and a week is too short to change anything. Ninety days is the unit where vision meets evidence.",
    "The framework moves through four movements — see it, shape it, schedule it, ship it — and ends with something you can point at.",
  ],
  movements: [
    { step: "01", title: "See it", body: "Get honest about the vision, and specific about what it looks like finished." },
    { step: "02", title: "Shape it", body: "Turn the vision into a strategy with constraints, priorities and trade-offs." },
    { step: "03", title: "Schedule it", body: "Break ninety days into weeks that carry real, dated commitments." },
    { step: "04", title: "Ship it", body: "Execute, review honestly, and carry the momentum into the next ninety." },
  ],
} as const;

export const teachingProgrammes: readonly Programme[] = [
  {
    name: "VisionCraft Academy",
    promise: "A structured learning environment",
    description:
      "For people who want a place to learn intentional growth and execution properly — with curriculum, cohorts and follow-through rather than one-off inspiration.",
    detail: ["Structured curriculum", "Cohort learning", "Execution accountability", "Live sessions"],
    action: { label: "Join the waitlist", href: "/contact" },
    media: { src: "portrait-burgundy-hands", alt: "Ebahi teaching", focus: "50% 20%" },
  },
  {
    name: "Ebahi Tayo Coaching Hub",
    promise: "Coaching, mentoring & personal development",
    description:
      "One-to-one and small-group work for people carrying something specific — a calling, a business, a team or a transition they need help navigating.",
    detail: ["1:1 coaching", "Small-group mentoring", "Leadership development", "Career & calling clarity"],
    action: { label: "Enquire about coaching", href: "/contact" },
    media: { src: "portrait-joyful-white", alt: "Ebahi in conversation", focus: "50% 20%" },
  },
  {
    name: "Workshops & masterclasses",
    promise: "Brought to your room",
    description:
      "Sessions for organisations, churches, schools and creative communities on leadership, creativity, purpose and personal development.",
    detail: ["Organisations", "Churches", "Schools", "Creative communities"],
    action: { label: "Invite Ebahi", href: "/work-with-me" },
    media: { src: "editorial-stance", alt: "Ebahi standing", focus: "50% 20%" },
  },
];

export const teachingRoadmap = [
  "Register for programmes",
  "Join waitlists",
  "Download resources",
  "Access teaching materials",
  "Book coaching & mentoring",
];

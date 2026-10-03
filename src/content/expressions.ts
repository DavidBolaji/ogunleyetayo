import type { Expression } from "./types";

/**
 * The six expressions of one calling. Ordering here is the ordering
 * everywhere the set is rendered — homepage index, footer, sitemap.
 */
export const expressions: readonly Expression[] = [
  {
    id: "music",
    index: "01",
    title: "Music Ministry",
    tagline: "Music is one of the primary ways I express my faith and calling.",
    summary:
      "Two decades of worship leadership, original songs and live recordings — music offered as ministry before it is offered as performance.",
    includes: [
      "Music ministry",
      "Worship leadership",
      "Original music",
      "Live recordings",
      "Music projects",
    ],
    action: { label: "Explore my music", href: "/music" },
    media: { src: "editorial-monochrome", alt: "Monochrome studio portrait of Ebahi", focus: "50% 30%" },
    brand: "ebahi",
  },
  {
    id: "silentshout",
    index: "02",
    title: "SilentShout",
    tagline: "Raising spiritually grounded and impact-driven gospel music creatives.",
    summary:
      "The SilentShout School of Music Ministry develops music ministers beyond musical skill — into spiritually formed, responsible and impactful ministers.",
    includes: [
      "School of Music Ministry",
      "Training",
      "Workshops",
      "Young Music Ministers Summit",
      "Resources for music ministers",
    ],
    action: { label: "Visit SilentShout", href: "/ministry" },
    media: { src: "portrait-white-standing", alt: "Ebahi standing in white", focus: "50% 25%" },
    brand: "silentshout",
  },
  {
    id: "teaching",
    index: "03",
    title: "Teaching & Mentoring",
    tagline: "Helping people move from ideas to intentional action.",
    summary:
      "Teaching, coaching and personal development work built around vision, strategy and execution — because information becomes powerful when it produces transformation.",
    includes: [
      "VisionCraft Academy",
      "Ebahi Tayo Coaching Hub",
      "Power of 90 Days",
      "Leadership and personal development",
      "Workshops and masterclasses",
    ],
    action: { label: "Learn with me", href: "/teaching" },
    media: { src: "portrait-burgundy-close", alt: "Portrait of Ebahi in a burgundy jacket", focus: "50% 22%" },
    brand: "ebahi",
  },
  {
    id: "books",
    index: "04",
    title: "Books & Resources",
    tagline: "Ideas that help you grow, pray, lead and live intentionally.",
    summary:
      "Writing that turns lived ministry into something portable — books, prayer systems and psalms you can carry into your own practice.",
    includes: ["Dear Worship Leader", "Prayed Up", "Simple Praying Systems", "Psalms of Ebahi"],
    action: { label: "Explore my books", href: "/books" },
    media: { src: "portrait-seated-profile", alt: "Ebahi seated in white, in profile", focus: "50% 25%" },
    brand: "ebahi",
  },
  {
    id: "edwoltz",
    index: "05",
    title: "Edwoltz Hair City",
    tagline: "Beauty, hair care, education and enterprise.",
    summary:
      "A hair business with a teaching habit — wig revamping, hair services and an ongoing conversation about hair waste and responsible beauty.",
    includes: [
      "Wig revamping",
      "Hair services",
      "Hair education",
      "Hair waste & environment",
      "YouTube education",
    ],
    action: { label: "Visit Edwoltz Hair City", href: "/edwoltz" },
    media: { src: "editorial-veil-close", alt: "Editorial beauty portrait of Ebahi", focus: "50% 30%" },
    brand: "edwoltz",
  },
  {
    id: "speaking",
    index: "06",
    title: "Speaking & Collaboration",
    tagline: "For churches, organisations, communities and creative spaces.",
    summary:
      "Conversations on worship, spiritual formation, calling, leadership, creativity and enterprise — shaped for the room they are walking into.",
    includes: [
      "Music ministry & worship",
      "Spiritual formation",
      "Young ministers",
      "Leadership & creativity",
      "Purpose & personal development",
      "Entrepreneurship",
    ],
    action: { label: "Invite Ebahi", href: "/work-with-me" },
    media: { src: "editorial-raised-hand", alt: "Ebahi speaking with a raised hand", focus: "50% 20%" },
    brand: "ebahi",
  },
];

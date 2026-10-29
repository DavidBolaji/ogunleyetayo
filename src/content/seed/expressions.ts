/* Seed corpus — the site's original copy, read once by scripts/seed-db.ts
 * to build data/. The database is the source of truth at runtime; nothing
 * in the app imports this folder. Kept so a fresh environment can be
 * re-seeded from a known-good baseline. */

/**
 * The six expressions of one calling. Ordering here is the ordering
 * everywhere the set is rendered — homepage index, footer, sitemap.
 */
export const expressions = [
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
    media: { src: "music-1", alt: "Ebahi in the studio, keyboards and a microphone behind her", focus: "50% 30%" },
    brand: "ebahi",
  },
  {
    id: "silentshout",
    index: "02",
    title: "SilentShout",
    tagline: "The global network — worship, formation, training and outreach.",
    summary:
      "SilentShout is the name over everything done ministerially: Music Impact (WUSH), the School of Music Ministry, the We Evangelise Project and The 5AM Tribe.",
    includes: [
      "SilentShout Music Impact (WUSH)",
      "School of Music Ministry",
      "We Evangelise Project",
      "The 5AM Tribe",
      "Young Music Ministers Summit",
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
    media: { src: "writing", alt: "Ebahi writing in a journal at her desk", focus: "50% 25%" },
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
    media: { src: "hair-city", alt: "Ebahi laughing, natural hair worn out, in a pink jacket", focus: "50% 30%" },
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

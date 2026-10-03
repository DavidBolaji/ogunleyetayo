import type { Programme } from "./types";

export const silentshout = {
  name: "SilentShout School of Music Ministry",
  headline: "Raising spiritually grounded and impact-driven gospel music creatives.",
  statement:
    "SilentShout exists to help music ministers develop beyond musical competence — cultivating spiritual depth, character, responsibility, creativity and relevance.",
  coreIdea: "From spiritual formation to earthly relevance.",
  about: [
    "Talent arrives early. Formation does not. Most young music ministers are handed a microphone long before anyone hands them a framework for character, responsibility or spiritual depth.",
    "SilentShout is the attempt to close that gap — a school, a set of workshops and a community where musical excellence and spiritual formation are taught as one subject, not two.",
  ],
  pillars: [
    {
      title: "Spiritual depth",
      body: "A private life with God that can carry the weight of a public gift.",
    },
    {
      title: "Character & responsibility",
      body: "Ministry habits, integrity, team conduct and the discipline of being trusted.",
    },
    {
      title: "Craft & creativity",
      body: "Musicianship, arrangement, leading a room and writing what has not been written yet.",
    },
    {
      title: "Relevance & impact",
      body: "Serving a real congregation, a real industry and a real generation — usefully.",
    },
  ],
} as const;

export const silentshoutProgrammes: readonly Programme[] = [
  {
    name: "School of Music Ministry",
    promise: "The core formation track",
    description:
      "A structured programme covering spiritual formation, ministry character, musicianship and the practical work of leading worship.",
    detail: ["Cohort-based", "Live teaching", "Mentoring", "Practical assignments"],
    action: { label: "Join the waitlist", href: "/contact" },
  },
  {
    name: "Workshops & masterclasses",
    promise: "Focused, intensive, practical",
    description:
      "Short-format sessions for music teams, church departments and creative collectives on specific areas of ministry and craft.",
    detail: ["Church music teams", "Worship departments", "Creative collectives"],
    action: { label: "Request a workshop", href: "/work-with-me" },
  },
  {
    name: "Resources for music ministers",
    promise: "Tools you can use this Sunday",
    description:
      "Guides, prayer systems and writing from years of leading worship and raising worship leaders.",
    detail: ["Dear Worship Leader", "Prayer systems", "Team guides"],
    action: { label: "Explore resources", href: "/books" },
  },
];

export const summit = {
  name: "The Young Music Ministers Summit",
  theme: "Stewarding the Call",
  description:
    "A gathering designed for young music ministers who are sensing and responding to God's call.",
  body: [
    "It is one thing to be gifted. It is another to know what to do with a calling you did not ask for and cannot shake.",
    "The Summit brings young music ministers into a room where that question is taken seriously — with teaching, worship, honest conversation and people further along the road.",
  ],
  forWho: [
    "Young worship leaders",
    "Church music team members",
    "Instrumentalists & vocalists",
    "Songwriters",
    "Music department leaders",
  ],
  sessions: [
    { title: "The call before the platform", body: "What God asks of a minister nobody is watching yet." },
    { title: "Stewarding the gift", body: "Practice, preparation and the discipline of craft." },
    { title: "Character in the music room", body: "Teams, authority, correction and staying trustworthy." },
    { title: "Sent, not stuck", body: "Carrying ministry into an industry and a generation." },
  ],
} as const;

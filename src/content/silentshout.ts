import type { Media, Programme } from "./types";

/**
 * SilentShout is the broad ministerial name — a network, not a single
 * programme. Everything below is one arm of it.
 */
export const silentshout = {
  name: "SilentShout Global Network",
  shortName: "SilentShout",
  headline: "One network. Four ways of raising people.",
  statement:
    "SilentShout is the name over everything done ministerially — worship, formation, training and outreach, held together by one conviction about what God does with a surrendered life.",
  coreIdea: "From spiritual formation to earthly relevance.",
  about: [
    "Talent arrives early. Formation does not. Most young music ministers are handed a microphone long before anyone hands them a framework for character, responsibility or spiritual depth.",
    "SilentShout grew to close that gap — and then kept growing. What began around worship now carries a school, a prayer community and an outreach arm, because formation that never leaves the room was never formation.",
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

/** The four arms of the network. */
export const silentshoutArms: readonly Programme[] = [
  {
    name: "SilentShout Music Impact",
    promise: "WUSH — Worship Until Something Happens",
    description:
      "The worship arm, and the gathering the network is built around. Worship held long enough for something to shift, across editions since 2014.",
    detail: ["2014", "2019", "2022", "2024"],
    action: { label: "See WUSH", href: "#wush" },
  },
  {
    name: "SilentShout School of Music Ministry",
    promise: "The formation track",
    description:
      "Where musical competence and spiritual formation are taught as one subject — cohorts, live teaching, mentoring and the Young Music Ministers Summit.",
    detail: ["Cohort-based", "Live teaching", "Mentoring", "The Summit"],
    action: { label: "About the school", href: "#school" },
  },
  {
    name: "We Evangelise Project",
    promise: "Reaching the unreached",
    description:
      "The outreach arm, run with non-profit and faith-based mission partners — the Gospel, relief and practical skill acquisition carried into rural communities.",
    detail: ["Seven communities since 2020", "Across Ibadan", "Gospel & relief", "Skill acquisition"],
    action: { label: "Partner with us", href: "/contact" },
  },
  {
    name: "The 5AM Tribe",
    promise: "One intentional hour, every morning",
    description:
      "A community of saints committed to praying daily at 5am for at least an hour — one of the network's spiritual formation pillars.",
    detail: ["Founded 2023", "Daily at 5am", "At least one hour", "Open to join"],
    action: { label: "Join the Tribe", href: "/contact" },
  },
];

/**
 * WUSH is the gathering SilentShout Music Impact exists for; the Summit
 * and the Young Ministers Programme run inside it.
 */
export const wush = {
  name: "WUSH",
  expansion: "Worship Until Something Happens",
  headline: "Worship until something happens.",
  statement:
    "The gathering SilentShout is built around — and the umbrella the school's programmes run inside.",
  body: [
    "Worship Until Something Happens is not a line about volume or length. It is a posture: you stay in the room until something shifts, and you let it shift you.",
    "Everything SilentShout teaches — formation, character, craft, relevance — is taught so it can show up here, among people who came to worship. The Young Music Ministers Summit runs inside WUSH.",
  ],
  editionsLabel: "Editions",
  editions: ["2014", "2019", "2022", "2024"],
  gallery: [
    {
      src: "wush-podium-group",
      alt: "Young ministers gathered at the podium during a WUSH session",
      focus: "50% 35%",
    },
    {
      src: "wush-certificates",
      alt: "Participants holding up their certificates at a WUSH closing ceremony",
      focus: "50% 40%",
    },
    {
      src: "wush-team-banner",
      alt: "The SilentShout team in front of the School of Music Ministry banner",
      focus: "50% 35%",
    },
    {
      src: "wush-delegates-banner",
      alt: "Delegates in front of the Young Ministers Programme banner",
      focus: "50% 30%",
    },
  ] satisfies readonly Media[],
} as const;

/** The 5AM Tribe, expanded — a formation pillar, not a side project. */
export const fiveAmTribe = {
  name: "The 5AM Tribe",
  founded: "2023",
  promise: "A community of saints committed to praying daily at 5am for at least one hour.",
  body: [
    "Inspired by the life of Jesus, who consistently sought His Father in the early morning, the Tribe gathers every morning to invest an intentional hour in prayer.",
    "What started as a simple commitment to prayer has grown into a thriving community where men and women find refuge, strength and intimacy with God.",
  ],
  rhythm: [
    { title: "Every morning", body: "Daily, at 5am — the hour before the day asks anything of you." },
    { title: "At least an hour", body: "Long enough to stop performing and start praying." },
    { title: "Together", body: "A tribe, not an app streak. People who show up for each other." },
    { title: "Open", body: "No qualification required beyond the willingness to be there." },
  ],
  action: { label: "Join the Tribe", href: "/contact" },
} as const;

/** The outreach arm. */
export const weEvangelise = {
  name: "We Evangelise Project",
  promise: "Reaching the unreached, in partnership.",
  body: [
    "Working with non-profit and faith-based mission organisations, SilentShout has been reaching the unreached since 2020.",
    "The team has brought the Gospel, relief and practical skill acquisition programmes to seven rural communities across Ibadan, with plans underway to serve two more this year.",
  ],
  stats: [
    { value: "7", label: "Rural communities reached" },
    { value: "2020", label: "Outreach began" },
    { value: "+2", label: "Communities planned this year" },
  ],
  action: { label: "Partner with the project", href: "/contact" },
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

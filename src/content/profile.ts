import type { Credential, Media, Recognition, TimelineEntry } from "./types";

export const profile = {
  heroHeadline: ["Faith.", "Creativity.", "Impact."] as const,
  heroSupport:
    "I am passionate about helping people grow deeply, create boldly and live purposefully.",
  meetHeading: "A life of music, ministry, teaching & impact",
  shortBio: [
    "Ebahi Tayo-Ogunleye is a gospel music minister, worship leader, author, entrepreneur and leadership mentor who believes deeply in the power of God to transform ordinary lives into remarkable stories of purpose.",
    "Aware of her own insignificance without Him, her life and work are built on a simple, heart-warming truth: that when we fix our eyes on God, He enables us to do far more than we could ever accomplish on our own.",
    "With over two decades of ministry experience, she serves as Music Director of Harvesthouse Christian Center, the Life Center Campus, and is the visionary behind the SilentShout Movement, WUSH, the SilentShout School of Music Ministry and VisionCraft Academy.",
  ],
  centralIdea: "From spiritual formation to earthly relevance.",
  portrait: {
    src: "portrait-open-hands",
    alt: "Ebahi Tayo-Ogunleye smiling, hands open",
    focus: "50% 20%",
  } satisfies Media,
} as const;

/** The official biography, in Ebahi's own words. */
export const fullBio = [
  "Ebahi Tayo-Ogunleye is a gospel music minister, worship leader, author, entrepreneur, and leadership mentor who believes deeply in the power of God to transform ordinary lives into remarkable stories of purpose.",
  "Aware of her own insignificance without Him, her life and work are built on a simple, heart-warming truth: that when we fix our eyes on God, He enables us to do far more than we could ever accomplish on our own.",
  "With over two decades of ministry experience, Ebahi serves as the Music Director of Harvesthouse Christian Center, the Life Center Campus, and is the visionary behind the SilentShout Movement, WUSH (Worship Until Something Happens), the SilentShout School of Music Ministry, and VisionCraft Academy. Through these platforms, she mentors worship leaders, minstrels, musicians and creatives to grow in spiritual maturity, authentic leadership and practical excellence.",
  "At the heart of her ministry is a passion for community transformation and Kingdom outreach. Collaborating with non-profit and faith-based mission organisations, SilentShout has been reaching the unreached. Since 2020, her team has brought the Gospel, relief and practical skill acquisition programmes to seven rural communities across Ibadan, with plans underway to serve two more rural communities this year.",
  "Driven by a desire to create safe, sacred spaces for spiritual growth, Ebahi also founded The 5AM Tribe in 2023. Inspired by the life of Jesus, who consistently sought His Father in the early morning, the Tribe gathers every morning to invest an intentional hour in prayer and seek God's presence. What started as a simple commitment to prayer has grown into a thriving community where men and women find refuge, strength and intimacy with God.",
  "Beyond ministry, Ebahi is the author of several impactful books — including Dear Worship Leader: 40 Heartsets to Improve Your Worship Leading, Prayed Up, Simple Praying Systems, and Psalms of Ebahi — and is a recording artist with three music projects.",
  "As an entrepreneur, she leads Edwoltz Hair City, a beauty and hair-care brand dedicated to restoring confidence, providing professional training and empowering others to build sustainable businesses rooted in integrity.",
  "Above all her accomplishments, Ebahi remains grateful for the grace that anchors her life. She is happily married to her best friend, Tayo Ogunleye, and together they are blessed with two wonderful daughters.",
] as const;

/** The one-line summary of why any of it exists. */
export const mission =
  "To see Christ glorified, worshippers matured, leaders equipped, and lives transformed for lasting Kingdom impact.";

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
    title: "Music Director, Harvesthouse Christian Center",
    body: "Serving as Music Director of Harvesthouse Christian Center, the Life Center Campus — carrying responsibility for sound, for people and for the spiritual culture a music team creates.",
  },
  {
    year: "2020",
    title: "We Evangelise — reaching the unreached",
    body: "Outreach began in partnership with non-profit and faith-based mission organisations. Seven rural communities across Ibadan have since received the Gospel, relief and practical skill acquisition programmes.",
  },
  {
    year: "2023",
    title: "The 5AM Tribe",
    body: "A community of saints committed to praying daily at 5am for at least an hour. What began as a simple commitment has grown into a place where men and women find refuge, strength and intimacy with God.",
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

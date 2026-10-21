import type { EnquiryRoute, NavItem, SocialLink } from "./types";

export const site = {
  name: "Ebahi Tayo-Ogunleye",
  shortName: "Ebahi Tayo",
  descriptor: "Gospel Music Minister · Worship Leader · Author · Entrepreneur · Leadership Mentor",
  thread: ["Faith", "Formation", "Creativity", "Impact"] as const,
  tagline: "Faith. Creativity. Impact.",
  positioning:
    "Ebahi Tayo-Ogunleye is a gospel music minister, worship leader, author, entrepreneur and leadership mentor who believes deeply in the power of God to transform ordinary lives into remarkable stories of purpose.",
  url: "https://ebahitayo.com",
  email: "hello@ebahitayo.com",
  phone: "+234 000 000 0000",
  whatsapp: "https://wa.me/2340000000000",
  location: "Lagos, Nigeria",
  church: "Harvesthouse Christian Center, the Life Center Campus",
} as const;

export const navigation: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Music", href: "/music" },
  { label: "Ministry", href: "/ministry" },
  { label: "Teaching", href: "/teaching" },
  { label: "Books", href: "/books" },
  { label: "Work With Me", href: "/work-with-me" },
  {
    label: "More",
    href: "/more",
    children: [
      { label: "SilentShout", href: "/ministry" },
      { label: "Young Music Ministers Summit", href: "/ministry/summit" },
      { label: "Edwoltz Hair City", href: "/edwoltz" },
      { label: "Hair & Environment", href: "/edwoltz/environment" },
      { label: "Resources", href: "/books#resources" },
      { label: "Journal", href: "/journal" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const socials: readonly SocialLink[] = [
  { platform: "Instagram", handle: "@ebahitayo", href: "https://instagram.com/ebahitayo" },
  { platform: "YouTube", handle: "Ebahi Tayo-Ogunleye", href: "https://youtube.com/@ebahitayo" },
  { platform: "TikTok", handle: "@ebahitayo", href: "https://tiktok.com/@ebahitayo" },
];

/** Separate inboxes keep three very different conversations from colliding. */
export const enquiryRoutes: readonly EnquiryRoute[] = [
  {
    label: "Music & SilentShout",
    description: "Ministrations, worship sessions, training, the Summit and school enquiries.",
    email: "music@ebahitayo.com",
    brand: "silentshout",
  },
  {
    label: "Speaking & Teaching",
    description: "Conferences, masterclasses, coaching, VisionCraft Academy and mentoring.",
    email: "speaking@ebahitayo.com",
    brand: "ebahi",
  },
  {
    label: "Edwoltz Hair City",
    description: "Wig revamping, hair services, hair education and business enquiries.",
    email: "hello@edwoltzhaircity.com",
    brand: "edwoltz",
  },
];

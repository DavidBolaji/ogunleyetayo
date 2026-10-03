import { site, socials } from "@/content/site";
import { credentials } from "@/content/profile";

/** Person schema so search engines understand who the site is about. */
export function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    email: `mailto:${site.email}`,
    image: `${site.url}/images/portrait-open-hands.webp`,
    description: site.positioning,
    jobTitle: ["Music Minister", "Teacher", "Mentor", "Author", "Creative Entrepreneur"],
    worksFor: { "@type": "Organization", name: site.church },
    address: { "@type": "PostalAddress", addressLocality: site.location },
    alumniOf: credentials.map((credential) => ({
      "@type": "EducationalOrganization",
      name: credential.institution,
    })),
    sameAs: socials.map((social) => social.href),
    knowsAbout: [
      "Music ministry",
      "Worship leadership",
      "Spiritual formation",
      "Leadership development",
      "Creative entrepreneurship",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

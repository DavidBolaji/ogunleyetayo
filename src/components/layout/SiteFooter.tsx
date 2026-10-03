import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { enquiryRoutes, navigation, site, socials } from "@/content/site";
import { expressions } from "@/content/expressions";

const year = new Date().getFullYear();

const primaryLinks = navigation.filter((item) => !item.children);

export function SiteFooter() {
  return (
    <footer className="grain relative bg-deep text-on-deep">
      <Container width="wide" className="relative z-10 py-20 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-on-deep-muted">Stay close to the work</p>
            <h2 className="mt-5 max-w-lg text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1]">
              A letter for people building something that outlives them.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-on-deep-muted">
              New music, teaching, resources and dates — sent occasionally, never carelessly.
            </p>
            <NewsletterForm className="mt-8 max-w-md" tone="deep" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <nav aria-label="Footer">
              <p className="eyebrow text-on-deep-muted">Navigate</p>
              <ul className="mt-5 space-y-2.5">
                {primaryLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-on-deep/85 transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="eyebrow text-on-deep-muted">Explore my work</p>
              <ul className="mt-5 space-y-2.5">
                {expressions.map((expression) => (
                  <li key={expression.id}>
                    <Link
                      href={expression.action.href}
                      className="text-sm text-on-deep/85 transition-colors hover:text-accent"
                    >
                      {expression.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="eyebrow mt-8 text-on-deep-muted">Connect with Ebahi</p>
              <ul className="mt-5 space-y-2.5">
                {socials.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-2 text-sm text-on-deep/85 transition-colors hover:text-accent"
                    >
                      {social.platform}
                      <span aria-hidden className="opacity-0 transition-opacity group-hover:opacity-100">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          {enquiryRoutes.map((route) => (
            <div key={route.email}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {route.label}
              </p>
              <a
                href={`mailto:${route.email}`}
                className="mt-2 block text-sm text-on-deep/80 underline-offset-4 hover:underline"
              >
                {route.email}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-on-deep-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-base tracking-tight text-on-deep">{site.tagline}</p>
          <p>
            © {year} {site.name}. All Rights Reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

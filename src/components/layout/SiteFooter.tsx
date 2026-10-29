import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { RichText } from "@/components/ui/RichText";
import { getItems, getNavigation, getSettings } from "@/lib/content";

/**
 * The footer, assembled from the same documents as the rest of the
 * site: the navigation document, a collection of expressions, the
 * socials and enquiry routes in settings. Nothing here is a literal.
 */
export async function SiteFooter() {
  const [settings, navigation] = await Promise.all([getSettings(), getNavigation()]);

  const [expressions, routes] = await Promise.all([
    getItems(settings.footer.exploreCollection, "expression"),
    getItems(settings.enquiry.routesCollection, "enquiryRoute"),
  ]);

  // The footer column mirrors the top-level header when it is not
  // curated separately, so a new page appears in both by default.
  const links = (
    navigation.footer.length > 0
      ? navigation.footer
      : navigation.header.filter((item) => item.children.length === 0)
  ).filter((item) => item.visible);

  const year = new Date().getFullYear();

  return (
    <footer className="grain relative bg-deep text-on-deep">
      <Container width="wide" className="relative z-10 py-20 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-on-deep-muted">{settings.footer.eyebrow}</p>
            <h2 className="mt-5 max-w-lg text-d-row leading-[1.1]">
              <RichText>{settings.footer.title}</RichText>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-on-deep-muted">
              <RichText>{settings.footer.body}</RichText>
            </p>
            <NewsletterForm className="mt-8 max-w-md" tone="deep" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <nav aria-label="Footer">
              <p className="eyebrow text-on-deep-muted">{settings.footer.navLabel}</p>
              <ul className="mt-5 space-y-2.5">
                {links.map((item) => (
                  <li key={item.id}>
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
              {expressions.length > 0 ? (
                <>
                  <p className="eyebrow text-on-deep-muted">{settings.footer.exploreLabel}</p>
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
                </>
              ) : null}

              {settings.socials.length > 0 ? (
                <>
                  <p className="eyebrow mt-8 text-on-deep-muted">{settings.footer.connectLabel}</p>
                  <ul className="mt-5 space-y-2.5">
                    {settings.socials.map((social) => (
                      <li key={social.id}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group inline-flex items-center gap-2 text-sm text-on-deep/85 transition-colors hover:text-accent"
                        >
                          {social.platform}
                          <span
                            aria-hidden
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            ↗
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {routes.length > 0 ? (
          <div className="mt-16 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
            {routes.map((route) => (
              <div key={route.id}>
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
        ) : null}

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-on-deep-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-base tracking-tight text-on-deep">
            {settings.site.tagline}
          </p>
          <p>
            © {year} {settings.site.name}. {settings.footer.rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}

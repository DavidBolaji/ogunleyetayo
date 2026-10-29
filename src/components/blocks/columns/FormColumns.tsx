import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { maxWidth } from "@/lib/blocks/scale";
import type { ColumnSpec, SocialLink } from "@/content/types";

type NewsletterSpec = Extract<ColumnSpec, { kind: "newsletter" }>;
type EnquirySpec = Extract<ColumnSpec, { kind: "enquiryForm" }>;
type ContactSpec = Extract<ColumnSpec, { kind: "contactDetails" }>;

export function NewsletterColumn({ spec, onDeep }: { spec: NewsletterSpec; onDeep: boolean }) {
  const tone = spec.tone === "deep" || onDeep ? "deep" : "light";

  return (
    <Reveal delay={0.16}>
      <div>
        {spec.note ? (
          <p
            className={cn(
              "text-base leading-relaxed",
              tone === "deep" ? "text-on-deep-muted" : "text-ink/75",
            )}
          >
            <RichText>{spec.note}</RichText>
          </p>
        ) : null}
        <NewsletterForm
          tone={tone}
          className={cn(spec.note && "mt-7", maxWidth[spec.maxWidth], "mx-auto")}
        />
      </div>
    </Reveal>
  );
}

const frameTones = { canvas: "bg-canvas", surface: "bg-surface" } as const;

export function EnquiryFormColumn({
  spec,
  eventTypes,
}: {
  spec: EnquirySpec;
  eventTypes: readonly string[];
}) {
  const form = (
    <EnquiryForm intent={spec.intent} eventTypes={eventTypes.length > 0 ? eventTypes : undefined} />
  );

  return (
    <Reveal delay={0.1}>
      {spec.framed ? (
        <div className={cn("border border-line p-6 sm:p-10", frameTones[spec.frameTone])}>
          {form}
        </div>
      ) : (
        form
      )}
    </Reveal>
  );
}

export function ContactDetailsColumn({
  spec,
  socials,
  onDeep,
}: {
  spec: ContactSpec;
  socials: readonly SocialLink[];
  onDeep: boolean;
}) {
  const label = onDeep ? "text-on-deep-muted" : "text-muted";

  return (
    <Reveal delay={0.16}>
      <dl className="space-y-6 text-sm">
        {spec.items.map((item, index) => (
          <div key={`${item.label}-${index}`}>
            <dt className={cn("eyebrow", label)}>{item.label}</dt>
            <dd className="mt-2">
              {item.href ? (
                <a href={item.href} className="hover:text-accent-ink">
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}

        {spec.socialsLabel && socials.length > 0 ? (
          <div>
            <dt className={cn("eyebrow", label)}>{spec.socialsLabel}</dt>
            <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline underline-offset-4 decoration-line hover:decoration-accent"
                >
                  {social.platform}
                </a>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </Reveal>
  );
}

import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { RichLines, RichText } from "@/components/ui/RichText";
import { ActionRow } from "@/components/blocks/ActionRow";
import { Chips } from "./Chips";
import { bodySize, maxWidth, textAlign, typeClass, typeStyle } from "@/lib/blocks/scale";
import type { ColumnSpec } from "@/content/types";

type ProseSpec = Extract<ColumnSpec, { kind: "prose" }>;

/** Body copy reads differently against a dark ground than a light one. */
const bodyTones = {
  body: { light: "text-ink/75", deep: "text-on-deep-muted" },
  muted: { light: "text-muted", deep: "text-on-deep-muted" },
  strong: { light: "text-ink", deep: "text-on-deep/90" },
} as const;

/** Optical top offset, for a column set beside a taller image. */
const offsets = { none: "", sm: "lg:pt-6", md: "lg:pt-8" } as const;

const quoteTones = {
  heading: { light: "text-ink", deep: "text-on-deep" },
  accent: { light: "text-accent-ink", deep: "text-accent" },
  body: { light: "text-ink/80", deep: "text-on-deep/85" },
} as const;

/**
 * The editorial text column.
 *
 * Nearly every two-column section on the site is "some text beside
 * something else", so this one component answers for all of their text
 * halves. Keeping it single means an editor learns one form and gets
 * consistent typography wherever they use it.
 */
export function ProseColumn({ spec, onDeep }: { spec: ProseSpec; onDeep: boolean }) {
  const Title = spec.titleTag;
  const align = spec.align ?? "left";
  const tone = bodyTones[spec.bodyTone][onDeep ? "deep" : "light"];
  const centered = align === "center";

  return (
    <div
      className={cn(
        maxWidth[spec.maxWidth],
        centered && "mx-auto",
        align !== "left" && textAlign[align],
        offsets[spec.offsetTop],
      )}
    >
      {spec.eyebrow ? (
        <Reveal>
          <Eyebrow className={onDeep ? "text-accent" : undefined}>{spec.eyebrow}</Eyebrow>
        </Reveal>
      ) : null}

      {spec.title ? (
        <Reveal delay={0.06}>
          <Title
            className={cn(
              spec.eyebrow && "mt-6",
              // A statement is display type without being a heading, so
              // it has to pick up the face and the body colour by hand.
              spec.titleTag === "p" && "font-display",
              typeClass(spec.titleType),
            )}
            style={typeStyle(spec.titleType)}
          >
            <RichLines>{spec.title}</RichLines>
          </Title>
        </Reveal>
      ) : null}

      {spec.note ? (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-7 font-display",
              maxWidth[spec.noteMaxWidth],
              onDeep ? "text-accent" : "text-accent-ink",
              typeClass(spec.noteType),
              centered && "mx-auto",
            )}
            style={typeStyle(spec.noteType)}
          >
            <RichText>{spec.note}</RichText>
          </p>
        </Reveal>
      ) : null}

      {spec.lede ? (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "mt-6 leading-relaxed",
              bodySize[spec.ledeSize ?? spec.bodySize],
              tone,
              maxWidth[spec.ledeMaxWidth],
              centered && "mx-auto",
            )}
          >
            <RichText>{spec.lede}</RichText>
          </p>
        </Reveal>
      ) : null}

      {spec.paragraphs.length > 0 ? (
        <div className={cn("mt-8 space-y-5 leading-relaxed", bodySize[spec.bodySize], tone)}>
          {spec.paragraphs.map((paragraph, index) => (
            <Reveal key={index} delay={0.14 + index * 0.05}>
              <p>
                <RichText>{paragraph}</RichText>
              </p>
            </Reveal>
          ))}
        </div>
      ) : null}

      {spec.quote ? (
        <Reveal delay={0.24}>
          <blockquote
            className={cn(
              "mt-10",
              spec.quote.style === "rule" && "border-l-2 border-accent pl-6",
              centered && "mx-auto",
            )}
          >
            <p
              className={cn(
                spec.quote.face === "display" && "font-display",
                quoteTones[spec.quote.tone][onDeep ? "deep" : "light"],
                typeClass(spec.quote.type),
              )}
              style={typeStyle(spec.quote.type)}
            >
              {spec.quote.quoted ? "“" : null}
              <RichLines>{spec.quote.text}</RichLines>
              {spec.quote.quoted ? "”" : null}
            </p>
            {spec.quote.caption ? (
              <footer
                className={cn(
                  "mt-3 text-xs uppercase tracking-[0.2em]",
                  onDeep ? "text-on-deep-muted" : "text-muted",
                )}
              >
                {spec.quote.caption}
              </footer>
            ) : null}
          </blockquote>
        </Reveal>
      ) : null}

      {spec.chips.length > 0 ? (
        <Reveal delay={0.28}>
          <div className="mt-8">
            {spec.chipsLabel ? (
              <p className={cn("eyebrow", onDeep ? "text-accent" : "text-accent-ink")}>
                {spec.chipsLabel}
              </p>
            ) : null}
            <Chips
              items={spec.chips}
              onDeep={onDeep}
              align={align}
              className={spec.chipsLabel ? "mt-5" : undefined}
            />
          </div>
        </Reveal>
      ) : null}

      {spec.actions.length > 0 ? (
        <Reveal delay={0.32}>
          <ActionRow
            actions={spec.actions}
            align={align}
            defaultVariant={onDeep ? "outlineLight" : "outline"}
            className="mt-9"
          />
        </Reveal>
      ) : null}
    </div>
  );
}

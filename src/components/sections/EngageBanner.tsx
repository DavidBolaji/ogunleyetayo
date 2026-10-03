import { ActionLink } from "@/components/ui/ActionLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Action } from "@/content/types";

interface EngageBannerProps {
  eyebrow?: string;
  title: string;
  body?: string;
  actions: readonly Action[];
  tone?: "sand" | "deep";
}

/** Closing call to action, reused at the foot of every page. */
export function EngageBanner({
  eyebrow = "How can I engage?",
  title,
  body,
  actions,
  tone = "sand",
}: EngageBannerProps) {
  const onDeep = tone === "deep";

  return (
    <Section tone={tone} size="md" width="wide" grain>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow className={onDeep ? "text-accent" : undefined}>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 max-w-2xl text-[clamp(1.875rem,4.5vw,3.25rem)] leading-[1.05]">
              {title}
            </h2>
          </Reveal>
          {body ? (
            <Reveal delay={0.1}>
              <p className={`mt-5 max-w-xl text-base leading-relaxed ${onDeep ? "text-on-deep-muted" : "text-ink/70"}`}>
                {body}
              </p>
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={0.14}>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {actions.map((action, index) => (
              <ActionLink
                key={action.href + action.label}
                {...action}
                variant={
                  index === 0 ? (onDeep ? "accent" : "solid") : onDeep ? "outlineLight" : "outline"
                }
                size="lg"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { credentials, recognitions } from "@/content/profile";

export function RecognitionStrip() {
  return (
    <Section tone="canvas" size="md" width="wide">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-20">
        <Reveal>
          <div>
            <Eyebrow>Selected recognition</Eyebrow>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Noted briefly, because the work matters more than the shelf it sits on.
            </p>
          </div>
        </Reveal>

        <div>
          <ul className="border-t border-line">
            {recognitions.map((item, index) => (
              <li key={item.title} className="border-b border-line">
                <Reveal delay={index * 0.05} from="none">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5">
                    <p className="font-display text-xl tracking-tight sm:text-2xl">{item.title}</p>
                    <p className="text-sm text-muted">{item.source}</p>
                    <p className="text-xs tabular-nums text-accent-ink">{item.year}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
              {credentials.map((credential) => (
                <div key={credential.qualification} className="max-w-xs">
                  <p className="text-sm font-semibold">{credential.qualification}</p>
                  <p className="text-xs text-muted">{credential.institution}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

import { ActionLink } from "@/components/ui/ActionLink";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-canvas pt-32">
      <Container width="narrow">
        <p className="eyebrow text-accent-ink">404</p>
        <h1 className="mt-6 text-[clamp(2.5rem,8vw,5rem)] uppercase leading-[0.95]">
          This page has not been written yet.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
          The link may have moved, or the project it pointed to is still being built.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ActionLink label="Back home" href="/" variant="solid" size="lg" />
          <ActionLink label="Explore the work" href="/#expressions" variant="outline" size="lg" />
        </div>
      </Container>
    </section>
  );
}

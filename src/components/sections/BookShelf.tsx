import { ActionLink } from "@/components/ui/ActionLink";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { Book } from "@/content/types";

interface BookShelfProps {
  books: readonly Book[];
}

/**
 * Cover art is not available yet, so each book gets a typographic cover
 * built from its own title — a real design object rather than a
 * placeholder box, and trivially swapped for artwork later.
 */
const covers = [
  "from-[#2a1030] to-[#5b2a68] text-[#f6ecdb]",
  "from-[#7a5407] to-[#c98f1e] text-[#fffaf0]",
  "from-[#1b2a4a] to-[#3f5d8f] text-[#eef2fd]",
  "from-[#3b2a20] to-[#8a5a2b] text-[#fbf1e4]",
];

export function BookShelf({ books }: BookShelfProps) {
  return (
    <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
      {books.map((book, index) => (
        <li key={book.slug}>
          <Reveal delay={(index % 2) * 0.08}>
            <article className="group grid gap-6 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] sm:gap-7">
              <div
                className={cn(
                  "relative flex aspect-[2/3] flex-col justify-between overflow-hidden bg-gradient-to-br p-5 shadow-[0_18px_40px_-24px_rgba(25,18,23,0.6)] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:-translate-y-1.5",
                  covers[book.accentIndex % covers.length],
                )}
              >
                <span aria-hidden className="absolute inset-y-0 left-2 w-px bg-white/20" />
                <p className="eyebrow text-[0.55rem] opacity-70">{book.kind}</p>
                <p className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] uppercase leading-[0.95]">
                  {book.title}
                </p>
                <p className="eyebrow text-[0.5rem] opacity-60">Ebahi Tayo-Ogunleye</p>
              </div>

              <div className="sm:pt-2">
                <h3 className="text-2xl leading-tight">{book.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">{book.description}</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {book.themes.map((theme) => (
                    <li
                      key={theme}
                      className="rounded-full bg-sand px-3 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-muted"
                    >
                      {theme}
                    </li>
                  ))}
                </ul>

                {book.action ? (
                  <div className="mt-6">
                    <ActionLink {...book.action} variant="link" />
                  </div>
                ) : null}
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

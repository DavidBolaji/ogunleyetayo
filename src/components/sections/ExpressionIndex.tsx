"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { ActionLink } from "@/components/ui/ActionLink";
import { Figure } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import type { Expression } from "@/content/types";

interface ExpressionIndexProps {
  expressions: readonly Expression[];
}

/**
 * Desktop: a ledger of numbered rows with a single large preview that
 * swaps as you move down the list. Mobile: the same data as stacked
 * cards. One data source, two appropriate presentations.
 */
export function ExpressionIndex({ expressions }: ExpressionIndexProps) {
  const [activeId, setActiveId] = useState(expressions[0]?.id ?? "");
  const active = expressions.find((item) => item.id === activeId) ?? expressions[0];

  return (
    <>
      {/* Desktop ledger */}
      <div className="hidden gap-16 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <ul className="border-t border-line">
          {expressions.map((expression, index) => {
            const isActive = expression.id === active?.id;

            return (
              <li key={expression.id} className="border-b border-line">
                <Link
                  href={expression.action.href}
                  onMouseEnter={() => setActiveId(expression.id)}
                  onFocus={() => setActiveId(expression.id)}
                  data-brand={expression.brand}
                  className="group block py-7 transition-colors"
                >
                  <Reveal delay={index * 0.04} from="none">
                    <div className="flex items-baseline gap-6">
                      <span
                        className={cn(
                          "font-display text-sm tabular-nums transition-colors",
                          isActive ? "text-accent" : "text-muted/60",
                        )}
                      >
                        {expression.index}
                      </span>

                      <div className="flex-1">
                        <h3
                          className={cn(
                            "font-display text-[clamp(1.6rem,3vw,2.6rem)] uppercase leading-none transition-all duration-500 ease-[var(--ease-out-soft)]",
                            isActive ? "translate-x-2 text-ink" : "text-ink/55",
                          )}
                        >
                          {expression.title}
                        </h3>

                        <div
                          className={cn(
                            "grid transition-all duration-500 ease-[var(--ease-out-soft)]",
                            isActive
                              ? "mt-3 grid-rows-[1fr] opacity-100"
                              : "mt-0 grid-rows-[0fr] opacity-0",
                          )}
                        >
                          <div className="overflow-hidden">
                            <p className="max-w-lg pl-2 text-sm leading-relaxed text-ink/70">
                              {expression.tagline}
                            </p>
                          </div>
                        </div>
                      </div>

                      <span
                        aria-hidden
                        className={cn(
                          "text-lg transition-all duration-500",
                          isActive
                            ? "translate-x-0 text-accent opacity-100"
                            : "-translate-x-3 opacity-0",
                        )}
                      >
                        →
                      </span>
                    </div>
                  </Reveal>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="relative" data-brand={active?.brand}>
          <div className="sticky top-32">
            <div className="relative aspect-[4/5] overflow-hidden bg-sand">
              <AnimatePresence mode="wait">
                {active ? (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Figure
                      media={active.media}
                      ratio="auto"
                      sizes="40vw"
                      className="h-full w-full"
                      scrim="soft"
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={`${active.id}-meta`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6"
                >
                  <p className="text-sm leading-relaxed text-ink/70">{active.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {active.includes.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.12em] text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    <ActionLink {...active.action} variant="link" />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <ul className="grid gap-8 sm:grid-cols-2 lg:hidden">
        {expressions.map((expression, index) => (
          <li key={expression.id} data-brand={expression.brand}>
            <Reveal delay={index * 0.05}>
              <Link href={expression.action.href} className="group block">
                <Figure
                  media={expression.media}
                  ratio="wide"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  scrim="soft"
                  className="transition-transform duration-700 ease-[var(--ease-out-soft)]"
                  imageClassName="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
                />

                <div className="mt-5 flex items-baseline gap-4">
                  <span className="font-display text-xs text-accent tabular-nums">
                    {expression.index}
                  </span>
                  <h3 className="font-display text-2xl uppercase leading-none">{expression.title}</h3>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-ink/70">{expression.tagline}</p>

                <span className="eyebrow mt-5 inline-flex items-center gap-2 text-accent-ink">
                  {expression.action.label}
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </>
  );
}

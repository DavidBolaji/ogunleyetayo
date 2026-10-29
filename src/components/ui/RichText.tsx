import { Fragment, type ReactNode } from "react";
import Link from "next/link";

/**
 * Inline markup for editable copy.
 *
 * The site's typography leans on phrases set in accent italic inside
 * otherwise plain paragraphs. Those used to be hand-written spans in
 * JSX, which is exactly the kind of thing that cannot live in a
 * database. A tiny inline grammar keeps the typography while keeping
 * the copy editable:
 *
 *   *accent italic*     the dominant editorial emphasis
 *   _accent_            accent colour, upright
 *   /italic/            italic only
 *   ~muted~             the secondary half of a line
 *   **bold**
 *   [label](/href)      a link
 *
 * Nodes are constructed, never injected as HTML, so nothing an editor
 * types can become markup.
 */

const PATTERN =
  /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|~[^~\n]+~|\/[^/\n]+\/|\[[^\]\n]+\]\([^)\s]+\))/g;

const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/|#)/;

function renderToken(token: string, key: number): ReactNode {
  if (token.startsWith("**") && token.endsWith("**")) {
    return <strong key={key}>{token.slice(2, -2)}</strong>;
  }

  if (token.startsWith("*") && token.endsWith("*")) {
    return (
      <em key={key} className="italic text-emphasis">
        {token.slice(1, -1)}
      </em>
    );
  }

  if (token.startsWith("_") && token.endsWith("_")) {
    return (
      <span key={key} className="text-emphasis">
        {token.slice(1, -1)}
      </span>
    );
  }

  if (token.startsWith("~") && token.endsWith("~")) {
    return (
      <span key={key} className="text-subtle">
        {token.slice(1, -1)}
      </span>
    );
  }

  if (token.startsWith("/") && token.endsWith("/")) {
    return (
      <em key={key} className="italic">
        {token.slice(1, -1)}
      </em>
    );
  }

  const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);

  if (link) {
    const [, label, href] = link;
    if (!SAFE_HREF.test(href)) return <Fragment key={key}>{label}</Fragment>;

    return /^https?:\/\//.test(href) ? (
      <a
        key={key}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="underline underline-offset-4 decoration-current/40 hover:decoration-current"
      >
        {label}
      </a>
    ) : (
      <Link key={key} href={href} className="underline underline-offset-4 hover:text-emphasis">
        {label}
      </Link>
    );
  }

  return <Fragment key={key}>{token}</Fragment>;
}

interface RichTextProps {
  children: string | undefined | null;
}

/** Parses one string of inline markup into React nodes. */
export function RichText({ children }: RichTextProps): ReactNode {
  if (!children) return null;

  const parts = children.split(PATTERN).filter((part) => part !== "");

  return parts.map((part, index) => renderToken(part, index));
}

/**
 * Line breaks inside a single field. Copy that needs a hard break —
 * a masthead set over three lines, say — uses a blank-safe separator
 * rather than embedded HTML.
 */
export function RichLines({ children }: RichTextProps): ReactNode {
  if (!children) return null;

  const lines = children.split("\n");

  return lines.map((line, index) => (
    <Fragment key={index}>
      {index > 0 ? <br /> : null}
      <RichText>{line}</RichText>
    </Fragment>
  ));
}

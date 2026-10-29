/**
 * Conversion between the site's inline markup and editable HTML.
 *
 * The dashboard edits formatted text in a contentEditable surface, so
 * what the writer sees is what the page says. It deliberately does not
 * *store* HTML: the site renders markup into React elements, never
 * into `dangerouslySetInnerHTML`, so there is no path by which pasted
 * markup can become live markup on the page. These two functions are
 * the bridge, and they are exact inverses of each other for every
 * construct the renderer understands.
 *
 * See [RichText](../../components/ui/RichText.tsx) for the grammar.
 */

export const TOKEN_PATTERN =
  /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|~[^~\n]+~|\/[^/\n]+\/|\[[^\]\n]+\]\([^)\s]+\))/g;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/|#|\{site\.[a-zA-Z]+\})/;

/** Markup to the HTML shown inside the editor. */
export function markupToHtml(markup: string): string {
  return markup
    .split("\n")
    .map((line) =>
      line
        .split(TOKEN_PATTERN)
        .filter((part) => part !== "")
        .map((token) => {
          if (token.startsWith("**") && token.endsWith("**")) {
            return `<strong>${escapeHtml(token.slice(2, -2))}</strong>`;
          }
          if (token.startsWith("*") && token.endsWith("*")) {
            return `<em class="adm-accent">${escapeHtml(token.slice(1, -1))}</em>`;
          }
          if (token.startsWith("_") && token.endsWith("_")) {
            return `<span class="adm-accent">${escapeHtml(token.slice(1, -1))}</span>`;
          }
          if (token.startsWith("~") && token.endsWith("~")) {
            return `<span class="adm-muted">${escapeHtml(token.slice(1, -1))}</span>`;
          }
          if (token.startsWith("/") && token.endsWith("/")) {
            return `<em>${escapeHtml(token.slice(1, -1))}</em>`;
          }

          const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);

          if (link && SAFE_HREF.test(link[2])) {
            return `<a href="${escapeHtml(link[2])}">${escapeHtml(link[1])}</a>`;
          }

          return escapeHtml(token);
        })
        .join(""),
    )
    .join("<br>");
}

/** The editor's DOM back to markup. */
export function htmlToMarkup(root: Node): string {
  let out = "";

  const walk = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Strip the characters that are markup, so typing an asterisk
      // cannot silently become formatting on save.
      out += (node.textContent ?? "").replace(/[*_~/[\]()]/g, "");
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as HTMLElement;
    const tag = element.tagName.toLowerCase();

    if (tag === "br") {
      out += "\n";
      return;
    }

    const inner = (): string => {
      const before = out;
      out = "";
      element.childNodes.forEach(walk);
      const captured = out;
      out = before;
      return captured;
    };

    if (tag === "strong" || tag === "b") {
      const text = inner();
      out += text.trim() ? `**${text}**` : text;
      return;
    }

    if (tag === "em" || tag === "i") {
      const text = inner();
      if (!text.trim()) return void (out += text);
      out += element.classList.contains("adm-accent") ? `*${text}*` : `/${text}/`;
      return;
    }

    if (tag === "a") {
      const href = element.getAttribute("href") ?? "";
      const text = inner();
      out += SAFE_HREF.test(href) && text.trim() ? `[${text}](${href})` : text;
      return;
    }

    if (tag === "span") {
      const text = inner();
      if (!text.trim()) return void (out += text);
      if (element.classList.contains("adm-accent")) out += `_${text}_`;
      else if (element.classList.contains("adm-muted")) out += `~${text}~`;
      else out += text;
      return;
    }

    // Block-level elements can arrive from a paste; treat them as lines.
    const isBlock = ["div", "p", "li", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tag);
    if (isBlock && out !== "" && !out.endsWith("\n")) out += "\n";

    element.childNodes.forEach(walk);
  };

  root.childNodes.forEach(walk);

  return out.replace(/\n{3,}/g, "\n\n").trim();
}

/** The toolbar, described once and rendered by the editor. */
export interface RichCommand {
  readonly id: string;
  readonly label: string;
  readonly title: string;
  readonly tag: "strong" | "em" | "span" | "a";
  readonly className?: string;
}

export const richCommands: readonly RichCommand[] = [
  { id: "bold", label: "B", title: "Bold", tag: "strong" },
  { id: "accent", label: "A", title: "Accent italic — the site's editorial emphasis", tag: "em", className: "adm-accent" },
  { id: "italic", label: "I", title: "Italic", tag: "em" },
  { id: "accentPlain", label: "A", title: "Accent colour, upright", tag: "span", className: "adm-accent" },
  { id: "muted", label: "M", title: "Muted — the secondary half of a line", tag: "span", className: "adm-muted" },
  { id: "link", label: "Link", title: "Link", tag: "a" },
];

/**
 * Converts a pasted media URL into an embeddable one.
 *
 * Only the three providers the site actually uses are recognised, and
 * only their embed paths are produced — so an editor cannot turn an
 * embed slot into an iframe pointing anywhere they like.
 */

const YOUTUBE_ID = /^[\w-]{6,20}$/;
const NUMERIC_ID = /^\d{4,15}$/;
const SPOTIFY_PATH = /^\/(track|album|playlist|episode|show)\/([A-Za-z0-9]{10,30})$/;

export interface Embed {
  readonly src: string;
  readonly title: string;
  readonly allow: string;
}

export function toEmbed(rawUrl: string, title: string): Embed | undefined {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    return undefined;
  }

  if (url.protocol !== "https:") return undefined;

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return YOUTUBE_ID.test(id) ? youtube(id, title) : undefined;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const fromQuery = url.searchParams.get("v");
    const fromPath = /^\/(?:embed|live|shorts)\/([\w-]+)$/.exec(url.pathname)?.[1];
    const id = fromQuery ?? fromPath;
    return id && YOUTUBE_ID.test(id) ? youtube(id, title) : undefined;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = /(\d{4,15})/.exec(url.pathname)?.[1];
    return id && NUMERIC_ID.test(id)
      ? {
          src: `https://player.vimeo.com/video/${id}`,
          title,
          allow: "autoplay; fullscreen; picture-in-picture",
        }
      : undefined;
  }

  if (host === "open.spotify.com") {
    const match = SPOTIFY_PATH.exec(url.pathname);
    return match
      ? {
          src: `https://open.spotify.com/embed/${match[1]}/${match[2]}`,
          title,
          allow: "clipboard-write; encrypted-media; fullscreen; picture-in-picture",
        }
      : undefined;
  }

  return undefined;
}

const youtube = (id: string, title: string): Embed => ({
  src: `https://www.youtube-nocookie.com/embed/${id}`,
  title,
  allow: "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
});

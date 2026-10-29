import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getMediaLibrary, getTheme } from "@/lib/content";
import { managedBlobKey } from "@/lib/media/paths";
import { DATA_ROOT } from "@/lib/db";

/**
 * The social share card.
 *
 * A shared link should show the portrait, the title and a line of the
 * text — which a raw 4:5 portrait cannot do, because every platform
 * crops a 1.91:1 card out of the middle of it. So the card is composed
 * here at the right aspect ratio instead.
 *
 * It is built in two passes. Sharp lays down the photograph and the
 * field of colour, and the layout renderer draws only the type over a
 * transparent layer. Keeping the photograph out of the renderer is
 * deliberate: its flex implementation sizes a background panel by its
 * siblings rather than by its own declared height, which letterboxes
 * the portrait. Compositing the two layers afterwards is exact, lets
 * the card ship as a JPEG rather than a PNG, and leaves the renderer
 * doing the one thing it is good at.
 *
 * Runs on the Node runtime: it reads image bytes from disk and
 * transcodes them, and the pipeline stores WebP, which the layout
 * renderer cannot decode.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/jpeg";

/** Width of the photograph panel. The type takes the rest. */
const PHOTO_WIDTH = 440;
const TEXT_WIDTH = OG_SIZE.width - PHOTO_WIDTH;
/** How far the colour bleeds over the photograph's left edge. */
const FEATHER = 130;

/**
 * Fraunces, for the display face.
 *
 * Fetched once and memoised. If it cannot be reached the card still
 * renders in the layout renderer's default face — a share image must
 * never be the reason a build fails.
 */
let displayFont: Promise<ArrayBuffer | undefined> | undefined;

const loadDisplayFont = (): Promise<ArrayBuffer | undefined> => {
  displayFont ??= (async () => {
    try {
      const css = await fetch(
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&display=swap",
        { headers: { "User-Agent": "Mozilla/5.0" } },
      ).then((response) => response.text());

      const url = /src:\s*url\((https:\/\/[^)]+\.(?:woff2?|ttf))\)/.exec(css)?.[1];
      if (!url) return undefined;

      return await fetch(url).then((response) => response.arrayBuffer());
    } catch {
      return undefined;
    }
  })();

  return displayFont;
};

/** Resolves a media reference to the file that holds its bytes. */
async function mediaFile(src: string): Promise<string> {
  const library = await getMediaLibrary();
  const item = library.items.find((candidate) => candidate.id === src);

  return item?.storage === "managed"
    ? path.join(DATA_ROOT, managedBlobKey(item.id))
    : path.join(process.cwd(), "public", "images", `${src}.webp`);
}

/** The media library's focus point, as fractions. Defaults to the site's. */
async function focusOf(src: string): Promise<{ x: number; y: number }> {
  const library = await getMediaLibrary();
  const focus = library.items.find((candidate) => candidate.id === src)?.focus ?? "50% 35%";

  const [x = 50, y = 35] = focus
    .split(/\s+/)
    .map((part) => Number.parseFloat(part))
    .map((value) => (Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 50));

  return { x: x / 100, y: y / 100 };
}

/**
 * Crops a photo to the panel, honouring its focus point.
 *
 * Sharp's `cover` crops from a fixed gravity, but the site art-directs
 * every photo with a CSS `object-position` — so the card scales and
 * extracts by hand to land on the same part of the frame the page
 * shows. The leading `trim` matters as much: several source exports
 * carry uniform white bands that the site's aspect-ratio frames crop
 * away and a share card otherwise would not.
 */
async function cropToPanel(file: string, focus: { x: number; y: number }): Promise<Buffer> {
  const source = sharp(await readFile(file));

  const trimmed = await source
    .clone()
    .trim({ threshold: 12 })
    .toBuffer({ resolveWithObject: true })
    .catch(() => undefined);

  const original = await source.metadata();
  const originalArea = (original.width ?? 1) * (original.height ?? 1);
  const trimmedArea = trimmed ? trimmed.info.width * trimmed.info.height : 0;

  // Keep the trim only when it removed a border; a trim that ate most
  // of the frame means the photo simply has a flat background.
  const useTrimmed = trimmed !== undefined && trimmedArea >= originalArea * 0.5;

  const input = useTrimmed ? sharp(trimmed.data) : source.clone();
  const width = useTrimmed ? trimmed.info.width : (original.width ?? PHOTO_WIDTH);
  const height = useTrimmed ? trimmed.info.height : (original.height ?? OG_SIZE.height);

  const scale = Math.max(PHOTO_WIDTH / width, OG_SIZE.height / height);
  const scaledWidth = Math.max(PHOTO_WIDTH, Math.round(width * scale));
  const scaledHeight = Math.max(OG_SIZE.height, Math.round(height * scale));

  return input
    .resize({ width: scaledWidth, height: scaledHeight, fit: "fill" })
    .extract({
      left: Math.round((scaledWidth - PHOTO_WIDTH) * focus.x),
      top: Math.round((scaledHeight - OG_SIZE.height) * focus.y),
      width: PHOTO_WIDTH,
      height: OG_SIZE.height,
    })
    .toBuffer();
}

/** The colour field with the photograph set into its right-hand edge. */
async function background(deep: string, src: string | undefined): Promise<Buffer> {
  const canvas = sharp({
    create: {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      channels: 3,
      background: deep,
    },
  });

  if (!src) return canvas.jpeg({ quality: 88 }).toBuffer();

  try {
    const [file, focus] = await Promise.all([mediaFile(src), focusOf(src)]);
    const photo = await cropToPanel(file, focus);

    // A soft edge rather than a hard seam between photo and colour.
    const feather = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${FEATHER}" height="${OG_SIZE.height}">` +
        `<defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="0">` +
        `<stop offset="0" stop-color="${deep}" stop-opacity="1"/>` +
        `<stop offset="1" stop-color="${deep}" stop-opacity="0"/>` +
        `</linearGradient></defs>` +
        `<rect width="100%" height="100%" fill="url(#f)"/></svg>`,
    );

    return canvas
      .composite([
        { input: photo, left: TEXT_WIDTH, top: 0 },
        { input: feather, left: TEXT_WIDTH, top: 0 },
      ])
      .jpeg({ quality: 88 })
      .toBuffer();
  } catch {
    // A missing or unreadable photo costs the portrait, not the card.
    return canvas.jpeg({ quality: 88 }).toBuffer();
  }
}

export interface CardInput {
  /** Small all-caps line above the title — a category, or the site name. */
  eyebrow: string;
  title: string;
  description?: string;
  /** Small line under the type — a date and reading time, say. */
  meta?: string;
  /** Media id of the photograph. */
  image?: string;
}

const truncate = (value: string, limit: number): string =>
  value.length > limit ? `${value.slice(0, limit - 1).trimEnd()}…` : value;

/** Builds the share card for one page or post. */
export async function renderCard(input: CardInput): Promise<Response> {
  const [theme, font] = await Promise.all([getTheme(), loadDisplayFont()]);

  const palette =
    theme.palettes.find((entry) => entry.id === theme.basePalette) ?? theme.palettes[0];

  const deep = palette.tokens.deep ?? "#2a1030";
  const onDeep = palette.tokens.onDeep ?? "#f6ecdb";
  const accent = palette.tokens.accent ?? "#c98f1e";
  const onDeepMuted = palette.tokens.onDeepMuted ?? "#c3aec6";

  const title = truncate(input.title, 90);

  const typeLayer = new ImageResponse(
    (
      <div
        style={{
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 56px",
          color: onDeep,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: accent,
          }}
        >
          <div style={{ width: 36, height: 2, backgroundColor: accent }} />
          <div>{truncate(input.eyebrow, 46)}</div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            maxWidth: TEXT_WIDTH - 112,
            /*
             * Omitted rather than set to undefined when the typeface
             * could not be fetched: the layout renderer parses this
             * value without checking it, so an explicit undefined
             * fails the build instead of falling back to its default.
             */
            ...(font ? { fontFamily: "Fraunces" } : {}),
            fontSize: title.length > 52 ? 54 : 68,
            lineHeight: 1.04,
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>

        {input.description ? (
          <div
            style={{
              display: "flex",
              marginTop: 26,
              maxWidth: TEXT_WIDTH - 112,
              fontSize: 26,
              lineHeight: 1.45,
              color: onDeepMuted,
            }}
          >
            {truncate(input.description, 190)}
          </div>
        ) : null}

        {input.meta ? (
          <div
            style={{
              display: "flex",
              marginTop: 32,
              paddingTop: 22,
              maxWidth: TEXT_WIDTH - 112,
              borderTop: `1px solid ${onDeepMuted}55`,
              fontSize: 21,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: onDeepMuted,
            }}
          >
            {truncate(input.meta, 58)}
          </div>
        ) : null}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font ? [{ name: "Fraunces", data: font, style: "normal", weight: 600 }] : undefined,
    },
  );

  const [ground, type] = await Promise.all([
    background(deep, input.image),
    typeLayer.arrayBuffer(),
  ]);

  const card = await sharp(ground)
    .composite([{ input: Buffer.from(type), left: 0, top: 0 }])
    .jpeg({ quality: 88, progressive: true })
    .toBuffer();

  return new Response(new Uint8Array(card), {
    headers: {
      "Content-Type": OG_CONTENT_TYPE,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

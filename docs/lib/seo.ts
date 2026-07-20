import type { Metadata } from "next";
import { baseUrl } from "@/app/metadata";
import {
  COVER_IMAGE_HEIGHT,
  COVER_IMAGE_WIDTH,
  coverImageFileExists,
  resolveCoverImagePaths,
} from "@/lib/cover-image";

const SITE_NAME = "SEED Design System";

export interface OgImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  /** MIME type, e.g. "image/png". Helps crawlers pick the image. */
  type?: string;
}

/**
 * Site-wide default Open Graph / Twitter image: the SEED brand card
 * (carrot field + SEED mark), same artwork as the landing hero's final frame.
 *
 * PNG on purpose — Facebook and LinkedIn don't reliably render WebP OG
 * previews. On-page `<img>` elements may still point at the WebP version
 * (`/og/default.webp`) for weight; only the crawler-facing OG uses PNG.
 */
export const DEFAULT_OG_IMAGE: OgImage = {
  url: "/og/default.png",
  width: COVER_IMAGE_WIDTH,
  height: COVER_IMAGE_HEIGHT,
  alt: SITE_NAME,
  type: "image/png",
};

/**
 * Resolve a frontmatter cover base path to its two rendered forms:
 * - `webp`: the on-page `<img>` source (lighter, lossless WebP)
 * - `og`: the crawler-facing Open Graph image (PNG for Facebook/LinkedIn
 *   compatibility, which don't reliably render WebP OG previews)
 *
 * The value may include or omit an image extension — any known one is stripped,
 * then `.webp` / `.png` are appended. Deployable covers must exist side by
 * side (e.g. `/og/default.webp` + `/og/default.png`) and are validated at
 * 3200×1680.
 */
export function resolveCoverImage(cover: string): {
  png: string;
  webp: string;
  thumbnail: string;
  og: OgImage;
} {
  const paths = resolveCoverImagePaths(cover);
  const hasWebp = coverImageFileExists(paths.webp);
  const hasPng = coverImageFileExists(paths.png);
  const ogUrl = hasPng ? paths.png : DEFAULT_OG_IMAGE.url;

  return {
    png: paths.png,
    webp: paths.webp,
    thumbnail: hasWebp ? paths.webp : hasPng ? paths.png : DEFAULT_OG_IMAGE.url,
    og: {
      url: ogUrl,
      width: COVER_IMAGE_WIDTH,
      height: COVER_IMAGE_HEIGHT,
      alt: SITE_NAME,
      type: "image/png",
    },
  };
}

export interface SeoInput {
  /** Page title. Omit to inherit (e.g. the root layout default). */
  title?: string;
  /** Page description. */
  description?: string;
  /** Override the OG/Twitter image. Defaults to the SEED brand card. */
  image?: OgImage;
}

/**
 * Build consistent page metadata: title/description + Open Graph + Twitter
 * summary-large-image card, with `metadataBase` so relative image paths resolve
 * to absolute URLs (required by crawlers, and by `output: "export"`).
 *
 * Use in a route's `generateMetadata`, or call with no args in the root layout
 * for the site-wide default OG. Pages that set only `title`/`description`
 * inherit the default image.
 *
 * @example
 * export function generateMetadata(): Metadata {
 *   return buildSeoMetadata({ title: "Foundations", description: "..." });
 * }
 */
export function buildSeoMetadata({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
}: SeoInput = {}): Metadata {
  return {
    metadataBase: baseUrl,
    ...(title !== undefined ? { title } : {}),
    ...(description !== undefined ? { description } : {}),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      images: [image.url],
    },
  };
}

export interface DocsPageMetadataInput {
  /** Frontmatter title (also the sidebar label). */
  title: string;
  /** Optional content heading that overrides `title` for display (designSchema pages). */
  heading?: string;
  description?: string;
  /** Static cover base path (frontmatter `coverImage`); resolved to the OG image. */
  coverImage?: string;
  /**
   * Resolved deprecated state — frontmatter `deprecated`, or a section's rootage
   * component status (via getComponentStatus). When true, the display title gets
   * a "(Deprecated)" suffix unless it already carries one.
   */
  deprecated?: boolean;
}

/**
 * Section detail-page metadata for every `[[...slug]]` route's `generateMetadata`.
 * Centralizes the shared wiring — the "(Deprecated)" title suffix rule and cover →
 * OG image resolution — so each route only resolves `deprecated` (some sections
 * consult rootage) and passes its frontmatter primitives.
 */
/**
 * Append a "(Deprecated)" suffix to a display title when the page is deprecated —
 * idempotent, so a title that already carries the suffix is left as-is. Shared by the
 * section detail Page bodies (DocsPageRenderer title / cover alt) and buildDocsPageMetadata
 * so the on-page heading and the metadata title never diverge.
 */
export function deprecatedTitle(title: string, deprecated?: boolean): string {
  return deprecated && !title.includes("(Deprecated)") ? `${title} (Deprecated)` : title;
}

export function buildDocsPageMetadata({
  title,
  heading,
  description,
  coverImage,
  deprecated,
}: DocsPageMetadataInput): Metadata {
  const displayTitle = deprecatedTitle(heading ?? title, deprecated);
  const cover = coverImage ? resolveCoverImage(coverImage) : null;

  return buildSeoMetadata({
    title: displayTitle,
    description,
    image: cover?.og,
  });
}

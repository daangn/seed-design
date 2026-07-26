import type { Metadata } from "next";
import { baseUrl } from "@/app/metadata";
import {
  COVER_IMAGE_HEIGHT,
  COVER_IMAGE_WIDTH,
  coverImageFileExists,
  resolveCoverImagePaths,
} from "@/lib/cover-image";

const SITE_NAME = "SEED Design System";
const SITE_LOCALE = "ko_KR";

/**
 * 섹션별 OG 폴백 카드. 페이지에 frontmatter `coverImage`가 없을 때 사이트 기본 카드 대신
 * 그 섹션의 카드를 쓴다 — 폴백 순서는 `coverImage` → 섹션 카드 → `/og/default`.
 *
 * 여기 없는 섹션(`components`·`foundations`·`breeze`·`docs`)은 전용 카드 에셋이 없어서
 * 자동으로 기본 카드로 떨어진다. `patterns`는 의도적으로 제외한다.
 *
 * `ai-integration`의 에셋 이름이 `ai-tools`인 것에 주의 — 섹션명과 다르다.
 */
const SECTION_OG_IMAGE_BASE: Record<string, string> = {
  react: "/og/react",
  lynx: "/og/lynx",
  "ai-integration": "/og/ai-tools",
  "get-started": "/og/get-started",
  updates: "/og/updates",
};

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

/**
 * 페이지 URL(`page.url`, 예: `/react/components/action-button`)에서 섹션을 뽑아 폴백 카드를
 * 찾는다. 모든 fumadocs 소스의 baseUrl이 `/` + 섹션명이라(`app/source.tsx`) 첫 경로 세그먼트가
 * 곧 섹션 키다. 에셋이 실제로 없으면 undefined를 돌려 기본 카드로 떨어뜨린다.
 */
function resolveSectionOgImage(url?: string): OgImage | undefined {
  if (!url) return undefined;

  const base = SECTION_OG_IMAGE_BASE[url.split("/")[1] ?? ""];
  if (!base) return undefined;

  const { png } = resolveCoverImagePaths(base);
  if (!coverImageFileExists(png)) return undefined;

  return {
    url: png,
    width: COVER_IMAGE_WIDTH,
    height: COVER_IMAGE_HEIGHT,
    alt: SITE_NAME,
    type: "image/png",
  };
}

export interface SeoInput {
  /** Page title. Omit to inherit (e.g. the root layout default). */
  title?: string;
  /** Page description. */
  description?: string;
  /** Override the OG/Twitter image. Defaults to the SEED brand card. */
  image?: OgImage;
  /**
   * Canonical path for this page (`page.url`). Emits `<link rel="canonical">`, which matters
   * because `public/_redirects` carries 22 permanent redirects into these URLs.
   */
  url?: string;
  /** Set for blog-style pages so the OG type becomes `article` instead of `website`. */
  publishedTime?: string;
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
  url,
  publishedTime,
}: SeoInput = {}): Metadata {
  const shared = {
    ...(title !== undefined ? { title } : {}),
    ...(description !== undefined ? { description } : {}),
  };

  return {
    metadataBase: baseUrl,
    ...shared,
    ...(url !== undefined ? { alternates: { canonical: url } } : {}),
    openGraph: {
      ...(publishedTime !== undefined
        ? ({ type: "article", publishedTime } as const)
        : ({ type: "website" } as const)),
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      ...(url !== undefined ? { url } : {}),
      ...shared,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      ...shared,
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
  /** Canonical path for this page — pass `page.url`. Also keys the section OG fallback. */
  url?: string;
  /** Blog-style pages only (frontmatter `publishedAt`). Switches the OG type to `article`. */
  publishedTime?: string;
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
  url,
  publishedTime,
}: DocsPageMetadataInput): Metadata {
  const displayTitle = deprecatedTitle(heading ?? title, deprecated);
  const cover = coverImage ? resolveCoverImage(coverImage) : null;

  return buildSeoMetadata({
    title: displayTitle,
    description,
    // 폴백 순서: 페이지 커버 → 섹션 카드 → 사이트 기본 카드(buildSeoMetadata의 기본값).
    // 본문 커버 이미지는 resolveCoverImage를 그대로 쓰므로 영향받지 않는다 — 섹션 폴백을
    // 거기 넣으면 커버가 없던 페이지 상단에 갑자기 큰 배너가 생긴다.
    image: cover?.og ?? resolveSectionOgImage(url),
    url,
    publishedTime,
  });
}

/**
 * 문서 페이지의 schema.org JSON-LD. Next의 `metadata` API로는 `ld+json`을 못 내보내므로
 * 반환값을 `<JsonLd>`(`components/json-ld.tsx`)로 렌더한다.
 */
export function buildDocsPageJsonLd(page: {
  url: string;
  data: { title: string; heading?: string; description?: string; publishedAt?: string | Date };
}) {
  const { title, heading, description, publishedAt } = page.data;
  const absoluteUrl = new URL(page.url, baseUrl).toString();
  const datePublished =
    publishedAt instanceof Date ? publishedAt.toISOString() : (publishedAt ?? undefined);

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: heading ?? title,
    ...(description !== undefined ? { description } : {}),
    url: absoluteUrl,
    mainEntityOfPage: absoluteUrl,
    ...(datePublished !== undefined ? { datePublished } : {}),
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: baseUrl.toString(),
    },
    publisher: {
      "@type": "Organization",
      name: "당근",
      url: baseUrl.toString(),
    },
  };
}

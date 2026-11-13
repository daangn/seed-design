import type { ComponentSearchEntry } from "./component-search";
import { type PublicFileExists, resolveCoverImage } from "./seo";

/** A rollout dashboard rather than a component, and left out of `/components` too. */
const PROGRESS_BOARD_URL = "/components/progress-board";

/** `components` 섹션 페이지 중 검색 카드가 읽는 필드. `src/content/source.ts#listPages`가 준다. */
export interface ComponentPageSummary {
  url: string;
  slugs: string[];
  title: string;
  description?: string;
  deprecated?: boolean;
  keywords?: string[];
  coverImage?: string;
}

/**
 * Flatten every component document into the shape the search dialog needs. Deprecated
 * components stay out: a card is a recommendation, and theirs carry neither cover nor
 * description — their pages still answer document search like any other.
 */
export function buildComponentSearchIndex(
  pages: ComponentPageSummary[],
  exists: PublicFileExists,
): ComponentSearchEntry[] {
  return pages
    .filter(
      (page) =>
        // Nested pages belong to a component the top-level page already stands for; the
        // section root has no slug at all.
        page.slugs.length === 1 && page.url !== PROGRESS_BOARD_URL && !page.deprecated,
    )
    .map((page) => {
      const { coverImage, keywords } = page;

      return {
        slug: page.slugs[0],
        title: page.title,
        url: page.url,
        ...(page.description && { description: page.description }),
        ...(keywords?.length && { keywords }),
        ...(coverImage && { thumbnail: resolveCoverImage(coverImage, exists).thumbnail }),
      } satisfies ComponentSearchEntry;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

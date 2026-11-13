import "server-only";

import { getComponentsSource } from "@/app/source";
import type { ComponentSearchEntry } from "./component-search";
import { resolveCoverImage } from "./seo";

/** A rollout dashboard rather than a component, and left out of `/components` too. */
const PROGRESS_BOARD_URL = "/components/progress-board";

/**
 * Flatten every component document into the shape the search dialog needs. Deprecated
 * components stay out: a card is a recommendation, and theirs carry neither cover nor
 * description — their pages still answer document search like any other.
 */
export async function buildComponentSearchIndex(): Promise<ComponentSearchEntry[]> {
  const source = await getComponentsSource();

  return source
    .getPages()
    .filter(
      (page) =>
        // Nested pages belong to a component the top-level page already stands for; the
        // section root has no slug at all.
        page.slugs.length === 1 &&
        page.url !== PROGRESS_BOARD_URL &&
        !page.data.frontmatter.deprecated,
    )
    .map((page) => {
      const { coverImage, keywords } = page.data.frontmatter;

      return {
        slug: page.slugs[0],
        title: page.data.title,
        url: page.url,
        ...(page.data.description && { description: page.data.description }),
        ...(keywords?.length && { keywords }),
        ...(coverImage && { thumbnail: resolveCoverImage(coverImage).thumbnail }),
      } satisfies ComponentSearchEntry;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

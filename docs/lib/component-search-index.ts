import "server-only";

import { getComponentsSource } from "@/app/source";
import { client } from "@/sanity-studio/lib/client";
import { ALL_COMPONENTS_QUERY } from "@/sanity-studio/lib/queries";
import type { ComponentData } from "@/sanity-studio/lib/types";
import type { ComponentSearchEntry } from "./component-search";
import { PLATFORM_CONFIG } from "./platform-status";
import { resolveCoverImage } from "./seo";

/** A rollout dashboard rather than a component, and left out of `/components` too. */
const PROGRESS_BOARD_URL = "/components/progress-board";

/**
 * Platform rollout per component id. A build without network access still has to produce an
 * index, so a failed query settles on an empty map and the cards render without badges —
 * the same way `app/_llms/rules/platform-status-rule.ts` treats it.
 */
async function fetchComponentData() {
  try {
    const components = await client.fetch<ComponentData[]>(ALL_COMPONENTS_QUERY);
    return new Map(components.map((component) => [component.id, component]));
  } catch {
    return new Map<string, ComponentData>();
  }
}

/** The component's Done(`ready`) platforms, as `components/platform-status-table.tsx` picks them. */
const donePlatforms = (component: ComponentData) =>
  PLATFORM_CONFIG.filter(({ key }) => component[`${key}Status`] === "ready").map(({ key }) => {
    const url = component[`${key}Url`];
    return { key, ...(url && { url }) };
  });

/**
 * Flatten every component document into the shape the search dialog needs. Deprecated
 * components stay out: a card is a recommendation, and theirs carry neither cover nor
 * description — their pages still answer document search like any other.
 */
export async function buildComponentSearchIndex(): Promise<ComponentSearchEntry[]> {
  const [source, componentData] = await Promise.all([getComponentsSource(), fetchComponentData()]);

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
      const slug = page.slugs[0];
      const { componentIds = [slug], coverImage } = page.data.frontmatter;

      return {
        slug,
        title: page.data.title,
        url: page.url,
        ...(page.data.description && { description: page.data.description }),
        ...(coverImage && { thumbnail: resolveCoverImage(coverImage).thumbnail }),
        components: componentIds
          .map((id) => componentData.get(id))
          .filter((component): component is ComponentData => Boolean(component))
          .map((component) => ({ name: component.name, platforms: donePlatforms(component) }))
          .filter(({ platforms }) => platforms.length > 0),
      } satisfies ComponentSearchEntry;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

import {
  type Section,
  getLLMMarkdownUrl,
  getSectionLLMIndexUrl,
  sectionConfigs,
  shouldIncludeInFullText,
} from "@/app/_llms/config";
import type { LLMPage } from "@/app/_llms/types";
import { getDisplayTitle } from "@/app/_llms/utils";
import { baseUrl } from "@/app/metadata";

/**
 * A pointer that is not a section, so the registry cannot describe it. The changelog is
 * the only one today — it splits per package and version under its own routes.
 */
export interface ExtraLink {
  label: string;
  path: string;
  description: string;
}

/**
 * Generic over the source's page type so `sort` sees the section's own frontmatter —
 * `updates` orders by `publishedAt`, which `LLMPage` alone does not declare.
 */
export interface SectionIndexOptions<TPage extends LLMPage> {
  section: Section;
  getSource: () => Promise<{ getPages(): TPage[] }>;
  /** Heading for the list itself — "Components", "Posts", "Documents". */
  listHeading: string;
  /** Defaults to slug order, which is wrong wherever the pages are not a reference set. */
  sort?: (a: TPage, b: TPage) => number;
  /** Sections worth reading next. Their label and description come from the registry. */
  related?: Section[];
  extraRelated?: ExtraLink[];
}

const bySlug = (a: LLMPage, b: LLMPage) => a.slugs.join("/").localeCompare(b.slugs.join("/"));

/**
 * Label and description come from the registry rather than the calling route. Written by
 * hand they went stale the moment a section moved — thirteen such links across ten routes
 * were what made the IA restructure invisible until the CLI stopped resolving them.
 */
export function renderRelatedSections(related: Section[], extra: ExtraLink[] = []): string {
  const entries = [
    ...related.map((section) => ({
      label: sectionConfigs[section].label,
      path: getSectionLLMIndexUrl(section),
      description: sectionConfigs[section].description,
    })),
    ...extra,
  ];
  if (entries.length === 0) return "";

  const lines = entries
    .map(
      ({ label, path, description }) => `- [${label}](${new URL(path, baseUrl)}): ${description}`,
    )
    .join("\n");

  return `\n## Related Sections\n\n${lines}\n`;
}

/**
 * Build the `GET` handler for a section's `/{section}/llms.txt` — the list of every page
 * it serves, each linking to that page's markdown.
 *
 * The links stay `/llms/{...}.txt` rather than the page URLs `llms(source).index()` would
 * emit. Those resolve to markdown only where `Accept` negotiation can run, and this site
 * is a static export: a bare page URL here is HTML, which is not what the file is for.
 *
 * Sections that group their pages into categories build their own list and are not on
 * this path; `get-started` is a single page and serves its body instead of a list.
 */
export function createSectionIndexRoute<TPage extends LLMPage>({
  section,
  getSource,
  listHeading,
  sort = bySlug,
  related = [],
  extraRelated = [],
}: SectionIndexOptions<TPage>): () => Promise<Response> {
  return async () => {
    const config = sectionConfigs[section];
    const source = await getSource();
    const pages = source.getPages().filter((page) => shouldIncludeInFullText(section, page.path));

    const list = [...pages]
      .sort(sort)
      .map((page) => {
        const url = new URL(getLLMMarkdownUrl(section, page.slugs), baseUrl);
        const deprecated = page.data.frontmatter.deprecated ? " (Deprecated)" : "";
        const description = page.data.description ? `: ${page.data.description}` : "";
        return `- [${getDisplayTitle(page, pages)}](${url})${deprecated}${description}`;
      })
      .join("\n");

    // No `sectionOverviewLine` here, unlike the routes that group by category: a flat list
    // already carries the section's root page as one of its entries.
    const quickAccess = config.fullText
      ? `\n## Quick Access\n\n- [전체 문서 (llms-full.txt)](${new URL(`${config.baseUrl}/llms-full.txt`, baseUrl)}): 모든 ${config.label} 문서를 하나의 파일로\n`
      : "";

    return new Response(
      `# ${config.label} - LLM Reference

${config.description}
${quickAccess}
## ${listHeading}

${list}
${renderRelatedSections(related, extraRelated)}`,
    );
  };
}

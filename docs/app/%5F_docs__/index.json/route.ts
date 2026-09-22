import type { DocsIndex } from "../../../../packages/cli/src/schema";
import { getDocUrl, getLLMMarkdownUrl, sectionConfigs, sections } from "@/app/_llms/config";
import { sectionSources } from "@/app/_llms/sources";
import { getDisplayTitle } from "@/app/_llms/utils";

export const revalidate = false;

// `output: "export"` emits this as a static JSON file, like /api/search.json.
export const dynamic = "force-static";

/**
 * `/__docs__/index.json`, the document list `@seed-design/cli` and `@seed-design/docs-mcp` read
 * at run time.
 *
 * The folder spells its leading underscore `%5F` because the App Router treats a folder named
 * `_x` as private and routes nothing inside it. Renamed to `__docs__`, the build still passes
 * and the index simply stops being published.
 */
export async function GET() {
  const sectionPages = await Promise.all(
    sections.map(async (section) => ({
      section,
      pages: (await sectionSources[section]()).getPages(),
    })),
  );

  const docsIndex: DocsIndex = {
    categories: sectionPages
      .filter(({ pages }) => pages.length > 0)
      .map(({ section, pages }) => ({
        id: section,
        label: sectionConfigs[section].label,
        items: pages
          .map((page) => ({
            // 섹션 루트 index.mdx만 slug가 없다. frontmatter title이 죄다 "Overview"라
            // 제목에서 뽑을 수도 없어서, CLI 텔레메트리가 `item_id`로 보낼 이름을 여기서 준다.
            id: page.slugs.at(-1) ?? "overview",
            // A category is one flat list, so two pages sharing a title are indistinguishable in it.
            title: getDisplayTitle(page, pages),
            ...(page.data.description && { description: page.data.description }),
            docUrl: getDocUrl(section, page.slugs),
            llmsUrl: getLLMMarkdownUrl(section, page.slugs),
            ...(page.data.frontmatter.deprecated && { deprecated: true }),
          }))
          .sort((a, b) => {
            if (a.id !== b.id) return a.id < b.id ? -1 : 1;
            if (a.docUrl === b.docUrl) return 0;
            return a.docUrl < b.docUrl ? -1 : 1;
          }),
      })),
  };

  return Response.json(docsIndex);
}

import { type Section, getLLMMarkdownUrl } from "./config";
import type { LLMPage } from "./types";

/**
 * The minimum `getDisplayTitle` reads. `LLMPage` satisfies it, and so do the plain
 * frontmatter/slug pairs `scripts/generate-docs-index.ts` assembles — the CLI index has
 * to disambiguate the same duplicate titles the llms.txt listings do.
 */
interface TitledPage {
  data: { title: string };
  slugs: string[];
}

export function getDisplayTitle(page: TitledPage, categoryPages: TitledPage[]): string {
  const title = page.data.title;
  const duplicates = categoryPages.filter((p) => p.data.title === title);
  if (duplicates.length <= 1) return title;

  const parentSlug = page.slugs.length >= 2 ? page.slugs[page.slugs.length - 2] : null;
  const hasSameParent = parentSlug
    ? duplicates.some(
        (p) => p !== page && p.slugs.length >= 2 && p.slugs[p.slugs.length - 2] === parentSlug,
      )
    : false;

  const disambiguator = hasSameParent ? page.slugs[page.slugs.length - 1] : parentSlug;

  if (disambiguator) {
    const label = disambiguator.charAt(0).toUpperCase() + disambiguator.slice(1);
    return `${title} (${label})`;
  }
  return `${title} (${page.slugs.join("/")})`;
}

/**
 * 카테고리별로 묶어 나열하는 섹션 llms.txt에서 루트 index.mdx를 실을 자리.
 *
 * 그 페이지는 slug가 없어 어느 카테고리에도 속하지 않는다. 카테고리를 하나 만들어
 * 끼우는 대신 Quick Access 줄로 내보내, 목록의 묶음 구조를 건드리지 않는다.
 * index.mdx가 없는 섹션에서는 빈 문자열이 되어 아무것도 추가하지 않는다.
 */
export function sectionOverviewLine(
  section: Section,
  pages: LLMPage[],
  siteUrl: string | URL,
): string {
  const page = pages.find((p) => p.slugs.length === 0);
  if (!page) return "";

  const url = new URL(getLLMMarkdownUrl(section, []), siteUrl);
  return `\n- [${page.data.title}](${url}): ${page.data.description ?? "섹션 개요"}`;
}

/** categoryOrder에 있는 것 먼저, 나머지는 알파벳순 */
export function sortCategories(
  categories: Map<string, LLMPage[]>,
  categoryOrder: string[],
): [string, LLMPage[]][] {
  const ordered = categoryOrder
    .filter((c) => categories.has(c))
    .map((c) => [c, categories.get(c)!] as [string, LLMPage[]]);

  const remaining = Array.from(categories.entries())
    .filter(([c]) => !categoryOrder.includes(c))
    .sort(([a], [b]) => a.localeCompare(b));

  return [...ordered, ...remaining];
}

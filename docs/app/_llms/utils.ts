/**
 * The minimum `getDisplayTitle` reads. `LLMPage` satisfies it, and so do the plain
 * frontmatter/slug pairs `scripts/generate-docs-index.ts` assembles — the CLI index has
 * to disambiguate the same duplicate titles the llms.txt listings do.
 */
interface TitledPage {
  data: { title: string };
  slugs: string[];
}

export function getDisplayTitle(page: TitledPage, siblings: TitledPage[]): string {
  const title = page.data.title;
  const duplicates = siblings.filter((p) => p.data.title === title);
  if (duplicates.length <= 1) return title;

  // 섹션 루트는 slug가 없어 꼬리표로 삼을 조각이 없다 — `${title} ()`가 되어버린다.
  // 섹션의 대표 개요이므로 제목을 그대로 두고, 꼬리표는 그 아래 문서들이 단다.
  if (page.slugs.length === 0) return title;

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

import type { LLMPage } from "./types";

export function getDisplayTitle(page: LLMPage, categoryPages: LLMPage[]): string {
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

import { z } from "zod";

/**
 * The subset of `/__docs__/index.json` this server reads.
 *
 * Deliberately not a copy of the docs site's section map: that map used to live here
 * as a hardcoded `SECTIONS` constant and went stale the moment the documentation IA
 * moved, with no way to fix an already-installed copy short of a release. Reading the
 * published index instead means older installs pick up structure changes on their own.
 *
 * Unknown keys are stripped rather than rejected so the site can extend the contract
 * without breaking this server.
 */
const docsIndexItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  docUrl: z.string(),
  llmsUrl: z.string().optional(),
  deprecated: z.boolean().optional(),
});

const docsIndexCategorySchema = z.object({
  id: z.string(),
  label: z.string(),
  llmsIndexUrl: z.string().optional(),
  llmsFullUrl: z.string().optional(),
  sections: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      items: z.array(docsIndexItemSchema),
    }),
  ),
});

export const docsIndexSchema = z.object({
  categories: z.array(docsIndexCategorySchema),
});

export type DocsIndex = z.infer<typeof docsIndexSchema>;
export type DocsIndexCategory = z.infer<typeof docsIndexCategorySchema>;
export type DocsIndexItem = z.infer<typeof docsIndexItemSchema>;

/**
 * The index nests category → section → item. This server has always called those
 * "section" and "category" in its tool contract, so the names are swapped at this
 * boundary rather than renaming the tools' arguments.
 */
export function findSection(index: DocsIndex, sectionId: string): DocsIndexCategory | undefined {
  return index.categories.find((category) => category.id === sectionId);
}

export function itemsOf(category: DocsIndexCategory, categoryFilter?: string) {
  return category.sections
    .filter((section) => !categoryFilter || section.id === categoryFilter)
    .flatMap((section) => section.items.map((item) => ({ item, categoryId: section.id })));
}

/**
 * The path `get_doc` accepts for an item: its `docUrl` with the section prefix removed.
 * A section's own landing page sits at the prefix itself, so it is addressed by id.
 */
export function itemPath(category: DocsIndexCategory, item: DocsIndexItem): string {
  if (item.docUrl === `/${category.id}`) return item.id;

  // Not `replace`, which strips the first occurrence wherever it sits: an item filed
  // outside its own section would come back mangled rather than merely unaddressable.
  const prefix = `/${category.id}/`;
  return item.docUrl.startsWith(prefix) ? item.docUrl.slice(prefix.length) : item.docUrl;
}

/**
 * Resolve a `get_doc` path such as `components/button` or `color` within a section.
 *
 * Matches the full docUrl first so a path that names its category stays unambiguous,
 * then falls back to a bare item id.
 *
 * @throws when the bare id names more than one document. `react` carries `alert-dialog`,
 * `bottom-sheet` and `menu-sheet` under both `components` and `stackflow`; answering with
 * whichever came first left the other unreachable through this argument.
 */
export function findItem(category: DocsIndexCategory, docPath: string): DocsIndexItem | undefined {
  const normalized = docPath.replace(/^\/+|\.txt$/g, "");
  const all = category.sections.flatMap((section) => section.items);

  const byDocUrl = all.find((item) => item.docUrl === `/${category.id}/${normalized}`);
  if (byDocUrl) return byDocUrl;

  const byId = all.filter((item) => item.id === normalized);
  if (byId.length > 1) {
    const paths = byId.map((item) => itemPath(category, item)).join(", ");
    throw new Error(
      `'${normalized}' is ambiguous in section '${category.id}'. Use one of: ${paths}`,
    );
  }

  return byId[0];
}

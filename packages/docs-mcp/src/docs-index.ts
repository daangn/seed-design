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
  llmsUrl: z.string(),
  deprecated: z.boolean().optional(),
});

const docsIndexCategorySchema = z.object({
  id: z.string(),
  label: z.string(),
  items: z.array(docsIndexItemSchema),
});

export const docsIndexSchema = z.object({
  categories: z.array(docsIndexCategorySchema),
});

export type DocsIndex = z.infer<typeof docsIndexSchema>;
export type DocsIndexCategory = z.infer<typeof docsIndexCategorySchema>;
export type DocsIndexItem = z.infer<typeof docsIndexItemSchema>;

/**
 * The index calls a top-level group a category; this server's tool contract has always
 * called it a section, so the name is swapped at this boundary rather than renaming the
 * tools' arguments.
 */
export function findSection(index: DocsIndex, sectionId: string): DocsIndexCategory | undefined {
  return index.categories.find((category) => category.id === sectionId);
}

/**
 * The document at `address`, a `docUrl` exactly as `search_docs` and `list_docs` print it.
 *
 * An `#anchor` is the one part set aside: it names a place inside the document, as a URL
 * fragment does, so a search result carrying one opens as printed. Nothing else is repaired, so
 * `react/components/button` without its leading slash names no document, like a path the index
 * never carried.
 */
export function findItem(index: DocsIndex, address: string): DocsIndexItem | undefined {
  const docUrl = address.split("#")[0];
  return index.categories
    .flatMap((category) => category.items)
    .find((item) => item.docUrl === docUrl);
}

/**
 * One listed document: the address, then the title and description of the document at it.
 *
 * Kept to one line whatever the index holds, so an entry never spills into the next one.
 */
export function docLine(address: string, item: DocsIndexItem): string {
  const title = item.deprecated ? `${item.title} (deprecated)` : item.title;
  const summary = item.description ? `${title} — ${item.description}` : title;
  return `${address}  ${summary.replace(/\s+/g, " ").trim()}`;
}

/**
 * One `search_docs` result, its address as the search printed it. An address the index lists
 * no page for is left bare rather than dropped, since the count printed above the list
 * includes it.
 */
export function searchResultLine(index: DocsIndex, address: string): string {
  const item = findItem(index, address);
  return item ? docLine(address, item) : address;
}

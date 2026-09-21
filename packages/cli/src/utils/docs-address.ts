import type { DocsCategory, DocsItem } from "@/src/schema";

/**
 * What the three `docs` subcommands take, and the line each of them prints per document.
 *
 * An address is a document's `docUrl`: the site's own path, leading slash included. `read`
 * takes one exactly as `list` and `search` print it, and `list` takes a section id exactly as
 * the index names it. Nothing is repaired on the way in — a path without its leading slash, a
 * trailing slash or a bare document name reaches nothing, the same as an address the site never
 * had — so the form `--help` shows is the only one there is.
 */

export interface DocsListing {
  address: string;
  note?: string;
}

/**
 * The document at `address`. An `#anchor` is set aside first: it names a place inside the
 * document, as a URL fragment does, so a `search` result or a URL copied off the site opens as
 * printed.
 */
export function findDocument(categories: DocsCategory[], address: string) {
  const docUrl = address.split("#")[0];
  return categories.flatMap((category) => category.items).find((item) => item.docUrl === docUrl);
}

/** Every document the categories hold, one listing each, in address order. */
export const documentListings = (categories: DocsCategory[]) =>
  categories
    .flatMap((category) => category.items)
    .map((item) => ({ address: item.docUrl, note: summaryOf(item) }))
    .sort(byAddress);

/**
 * What a line says about the document at its address: the title, then the description.
 *
 * Collapsed onto one line whatever the index holds, because callers grep these lines and a
 * description wrapped onto a second one would drop out of every match.
 */
export function summaryOf(item: DocsItem): string {
  const title = item.deprecated ? `${item.title} (deprecated)` : item.title;
  const line = item.description ? `${title} — ${item.description}` : title;
  return line.replace(/\s+/g, " ").trim();
}

/**
 * Codepoint order, not `localeCompare`. ICU ignores `/` and `-` at its primary strength, so
 * the same listing would come out in a different order under a different `LC_ALL`, and this
 * output is piped and diffed.
 */
export function byAddress(a: DocsListing, b: DocsListing): number {
  return a.address < b.address ? -1 : a.address > b.address ? 1 : 0;
}

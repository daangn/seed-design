import type { DocsCategory, DocsItem } from "@/src/schema";

/**
 * The address grammar the three `docs` subcommands share.
 *
 * An address is the document site's own path with the domain taken off, so anything printed
 * here is accepted back verbatim and anything copied off the site works as typed. Three
 * forms, told apart by the slashes:
 *
 *   /react/components/action-button   exact    the whole path, matched entire: 0 or 1
 *   action-button                     tail     the path's last segments: 0 or more
 *   react/                            scope    everything underneath: 0 or more
 *
 * The leading slash is what separates an exact address from a shortened name, and it earns
 * its place: 51 document paths are the tail of some other document path, so
 * `components/bottom-sheet` is a complete path and a three-way ambiguity at the same time.
 * The trailing slash separates a container from the document sitting at the same path — a
 * category's landing page is `/react`, and what the category holds is `react/`.
 *
 * The two slashes are independent: a scope is shortened exactly as an address is, so
 * `stackflow/` reaches `/react/stackflow` the same way `stackflow` reaches the document
 * under it, and `/stackflow/` insists on a top-level container by that name.
 */

export interface DocsEntry {
  category: DocsCategory;
  item: DocsItem;
  address: string;
}

export type Address =
  | { kind: "exact"; segments: string[] }
  | { kind: "tail"; segments: string[] }
  | { kind: "scope"; anchored: boolean; segments: string[] };

/** The site path of a document, always with its leading slash. */
export function addressOf(item: DocsItem): string {
  return item.docUrl.startsWith("/") ? item.docUrl : `/${item.docUrl}`;
}

export function entriesOf(categories: DocsCategory[]): DocsEntry[] {
  return categories.flatMap((category) =>
    category.items.map((item) => ({ category, item, address: addressOf(item) })),
  );
}

export function pathOf(address: Address): string {
  return `/${address.segments.join("/")}`;
}

/**
 * Nothing at all is the root scope, which is what `list` answers with no argument. Reading
 * or searching it is a miss rather than a listing, and each command says so in its own
 * words.
 */
export function parseAddress(input: string): Address {
  const trimmed = input.trim();
  const segments = trimmed.split("/").filter(Boolean);
  const anchored = trimmed.startsWith("/");

  if (segments.length === 0) return { kind: "scope", anchored: true, segments: [] };
  if (trimmed.endsWith("/")) return { kind: "scope", anchored, segments };
  if (anchored) return { kind: "exact", segments };

  return { kind: "tail", segments };
}

/** Whether `path` ends with `segments`, segment by segment rather than character by character. */
function endsWithSegments(path: string, segments: string[]): boolean {
  const parts = path.split("/").filter(Boolean);
  if (segments.length === 0 || segments.length > parts.length) return false;

  const offset = parts.length - segments.length;
  return segments.every((segment, index) => parts[offset + index] === segment);
}

/**
 * The documents an address names. A scope names a container rather than a document, so it
 * reaches none: `read` turns that into its own message instead of picking something from
 * underneath.
 */
export function resolveDocuments(categories: DocsCategory[], address: Address): DocsEntry[] {
  if (address.kind === "scope") return [];

  const entries = entriesOf(categories);
  if (address.kind === "exact") {
    const path = pathOf(address);
    return entries.filter((entry) => entry.address === path);
  }

  return entries.filter((entry) => endsWithSegments(entry.address, address.segments));
}

/**
 * Every path that holds something, each with the trailing slash that marks it a container.
 *
 * Derived from the document addresses rather than declared anywhere, so a container exists
 * here exactly when a document sits under it.
 */
export function containersOf(categories: DocsCategory[]): string[] {
  const containers = new Set<string>();

  for (const { address } of entriesOf(categories)) {
    const parts = address.split("/").filter(Boolean);
    for (let depth = 1; depth < parts.length; depth++) {
      containers.add(`/${parts.slice(0, depth).join("/")}/`);
    }
  }

  return Array.from(containers);
}

/** Every path the index reaches, a document's own path and each container above it alike. */
function pathsOf(categories: DocsCategory[]): string[] {
  const paths = new Set<string>();

  for (const { address } of entriesOf(categories)) {
    const parts = address.split("/").filter(Boolean);
    for (let depth = 1; depth <= parts.length; depth++) {
      paths.add(`/${parts.slice(0, depth).join("/")}`);
    }
  }

  return Array.from(paths);
}

/**
 * The places a `list` address names. A shortened address can name several, and listing under
 * each of them is the ordinary outcome rather than a failure.
 */
export function resolveScopes(categories: DocsCategory[], address: Address): string[] {
  if (address.kind === "scope" && address.segments.length === 0) return [""];
  if (address.kind === "exact" || (address.kind === "scope" && address.anchored)) {
    return [pathOf(address)];
  }

  return pathsOf(categories).filter((path) => endsWithSegments(path, address.segments));
}

export interface DocsListing {
  address: string;
  note?: string;
}

/**
 * One level below `scope`, and no deeper. A container is printed with its trailing slash and
 * a document without one, so each line says which subcommand takes it next.
 *
 * A container's note counts the documents anywhere beneath it, not the lines its own listing
 * would print, so it names that unit rather than leaving the two numbers to be read as one.
 */
export function childrenOf(categories: DocsCategory[], scope: string): DocsListing[] {
  const prefix = `${scope}/`;
  const containerCounts = new Map<string, number>();
  const documents: DocsListing[] = [];

  for (const entry of entriesOf(categories)) {
    if (!entry.address.startsWith(prefix)) continue;

    const [head, ...rest] = entry.address.slice(prefix.length).split("/");
    if (rest.length === 0) {
      documents.push({
        address: entry.address,
        note: entry.item.deprecated ? `${entry.item.title} (deprecated)` : entry.item.title,
      });
      continue;
    }

    containerCounts.set(head, (containerCounts.get(head) ?? 0) + 1);
  }

  const containers = Array.from(containerCounts, ([head, count]) => ({
    address: `${prefix}${head}/`,
    note: `문서 ${count}개`,
  }));

  return [...containers, ...documents].sort(byAddress);
}

/**
 * Codepoint order, not `localeCompare`. ICU ignores `/` and `-` at its primary strength, so
 * the same listing would come out in a different order under a different `LC_ALL`, and this
 * output is piped and diffed.
 */
export function byAddress(a: DocsListing, b: DocsListing): number {
  return a.address < b.address ? -1 : a.address > b.address ? 1 : 0;
}

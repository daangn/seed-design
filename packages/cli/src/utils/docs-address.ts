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
 */

export interface DocsEntry {
  category: DocsCategory;
  item: DocsItem;
  address: string;
}

export type Address =
  | { kind: "exact"; path: string }
  | { kind: "tail"; segments: string[] }
  | { kind: "scope"; path: string };

/** The site path of a document, always with its leading slash. */
export function addressOf(item: DocsItem): string {
  return item.docUrl.startsWith("/") ? item.docUrl : `/${item.docUrl}`;
}

export function entriesOf(categories: DocsCategory[]): DocsEntry[] {
  return categories.flatMap((category) =>
    category.sections.flatMap((section) =>
      section.items.map((item) => ({ category, item, address: addressOf(item) })),
    ),
  );
}

export function parseAddress(input: string): Address {
  const trimmed = input.trim();
  const segments = trimmed.split("/").filter(Boolean);
  const path = `/${segments.join("/")}`;

  if (trimmed.endsWith("/")) return { kind: "scope", path: segments.length > 0 ? path : "" };
  if (trimmed.startsWith("/")) return { kind: "exact", path };

  return { kind: "tail", segments };
}

/** Whether `path` ends with `segments`, segment by segment rather than character by character. */
function endsWithSegments(path: string, segments: string[]): boolean {
  const parts = path.split("/").filter(Boolean);
  if (segments.length === 0 || segments.length > parts.length) return false;

  const offset = parts.length - segments.length;
  return segments.every((segment, index) => parts[offset + index] === segment);
}

/** The documents an address names. `read` insists on exactly one; the others do not. */
export function resolveDocuments(categories: DocsCategory[], address: Address): DocsEntry[] {
  const entries = entriesOf(categories);

  if (address.kind === "exact") return entries.filter((entry) => entry.address === address.path);

  if (address.kind === "scope") {
    return entries.filter((entry) => entry.address.startsWith(`${address.path}/`));
  }

  return entries.filter((entry) => endsWithSegments(entry.address, address.segments));
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
 * The places a `list` address names. A tail query can name several, and listing under each
 * of them is the ordinary outcome rather than a failure.
 */
export function resolveScopes(categories: DocsCategory[], address: Address): string[] {
  if (address.kind === "tail") {
    return pathsOf(categories).filter((path) => endsWithSegments(path, address.segments));
  }

  return [address.path];
}

export interface DocsListing {
  address: string;
  note?: string;
}

/**
 * One level below `scope`, and no deeper. A container is printed with its trailing slash and
 * a document without one, so each line says which subcommand takes it next.
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
    note: `${count}개 항목`,
  }));

  return [...containers, ...documents].sort((a, b) => a.address.localeCompare(b.address));
}

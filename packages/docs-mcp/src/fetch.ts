import { LRUCache } from "lru-cache";
import {
  SEED_DOCS_BASE_URL,
  ROOTAGE_ENDPOINTS,
  DOCS_INDEX_ENDPOINT,
  DEFAULT_TIMEOUT,
} from "./constants.js";
import {
  type DocsIndex,
  type DocsIndexCategory,
  docsIndexSchema,
  findItem,
  findSection,
  itemPath,
  itemsOf,
} from "./docs-index.js";
import type { DocInfo } from "./types.js";

// biome-ignore lint/suspicious/noExplicitAny: cache stores various types
const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 5 * 60 * 1000,
  maxSize: 50 * 1024 * 1024,
  sizeCalculation: (value) => JSON.stringify(value).length,
  updateAgeOnGet: true,
});

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached) {
    return cached as T;
  }

  const response = await fetch(url, { signal: AbortSignal.timeout(DEFAULT_TIMEOUT) }).catch(
    (error) => {
      // The DOMException this raises names neither the URL nor the limit, and it is what
      // the MCP client puts in front of the model.
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new Error(`Timed out after ${DEFAULT_TIMEOUT}ms fetching ${url}`);
      }
      throw error;
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  let data: T;

  if (contentType?.includes("application/json")) {
    data = (await response.json()) as T;
  } else {
    data = (await response.text()) as T;
  }

  cache.set(url, data);
  return data;
}

export async function fetchDocsIndex(): Promise<DocsIndex> {
  const raw = await fetchWithCache<unknown>(`${SEED_DOCS_BASE_URL}${DOCS_INDEX_ENDPOINT}`);
  const parsed = docsIndexSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(`Failed to parse the docs index: ${parsed.error.message}`);
  }

  return parsed.data;
}

/**
 * Resolve a section, or throw with the live section list so a caller working from a
 * stale prompt can correct itself instead of guessing.
 */
export async function requireSection(sectionId: string): Promise<DocsIndexCategory> {
  const index = await fetchDocsIndex();
  const section = findSection(index, sectionId);

  if (!section) {
    const available = index.categories.map((category) => category.id).join(", ");
    throw new Error(`Unknown section '${sectionId}'. Available sections: ${available}`);
  }

  return section;
}

export async function fetchSectionFull(sectionId: string): Promise<string> {
  const section = await requireSection(sectionId);

  if (!section.llmsFullUrl) {
    throw new Error(
      `Section '${sectionId}' has no llms-full.txt. Use list_docs and get_doc instead.`,
    );
  }

  return fetchWithCache<string>(`${SEED_DOCS_BASE_URL}${section.llmsFullUrl}`);
}

export async function fetchDocsList(sectionId: string, category?: string): Promise<DocInfo[]> {
  const section = await requireSection(sectionId);

  if (category && !section.sections.some((s) => s.id === category)) {
    const available = section.sections.map((s) => s.id).join(", ");
    throw new Error(
      `Unknown category '${category}' in section '${sectionId}'. Available: ${available}`,
    );
  }

  return itemsOf(section, category).map(({ item, categoryId }) => ({
    title: item.title,
    path: itemPath(section, item),
    url: `${SEED_DOCS_BASE_URL}${item.llmsUrl ?? `/llms${item.docUrl}.txt`}`,
    category: categoryId,
    ...(item.description && { description: item.description }),
    ...(item.deprecated && { deprecated: true }),
  }));
}

export async function fetchDoc(sectionId: string, docPath: string): Promise<string> {
  const section = await requireSection(sectionId);
  const item = findItem(section, docPath);

  if (!item) {
    throw new Error(
      `No document at '${docPath}' in section '${sectionId}'. Use list_docs to see available paths.`,
    );
  }

  return fetchWithCache<string>(
    `${SEED_DOCS_BASE_URL}${item.llmsUrl ?? `/llms${item.docUrl}.txt`}`,
  );
}

export interface RootageIndex {
  name: string;
  version: string;
  resources: Array<{ path: string }>;
}

export async function fetchRootageIndex(): Promise<RootageIndex> {
  return fetchWithCache<RootageIndex>(`${SEED_DOCS_BASE_URL}${ROOTAGE_ENDPOINTS.INDEX}`);
}

/**
 * Resolve the request against the index before fetching it.
 *
 * The argument used to be concatenated straight onto the base URL, so a `../` in it
 * addressed pages outside `/rootage` — a reach the tool does not advertise, and one that
 * stops being confined to a public site the moment `SEED_DOCS_BASE_URL` moves.
 */
export async function fetchRootageResource(path: string): Promise<unknown> {
  const index = await fetchRootageIndex();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const resource = index.resources.find((entry) => entry.path === normalized);

  if (!resource) {
    throw new Error(
      `Unknown rootage resource '${path}'. None of the ${index.resources.length} resources in the index match.`,
    );
  }

  return fetchWithCache<unknown>(`${SEED_DOCS_BASE_URL}${ROOTAGE_ENDPOINTS.BASE}${resource.path}`);
}

export function clearCache(): void {
  cache.clear();
}

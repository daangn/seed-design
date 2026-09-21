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
} from "./docs-index.js";

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

/** Every document in one section, or in every section when none is named. */
export async function fetchDocsList(sectionId?: string) {
  if (sectionId !== undefined) return (await requireSection(sectionId)).items;

  return (await fetchDocsIndex()).categories.flatMap((category) => category.items);
}

export async function fetchDoc(address: string): Promise<string> {
  const item = findItem(await fetchDocsIndex(), address);

  if (!item) {
    throw new Error(`No document at '${address}'. Find its address with search_docs or list_docs.`);
  }

  return fetchWithCache<string>(`${SEED_DOCS_BASE_URL}${item.llmsUrl}`);
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
  const resource = index.resources.find((entry) => entry.path === path);

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

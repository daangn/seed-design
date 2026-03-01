import { LRUCache } from "lru-cache";
import {
  DEFAULT_CACHE_MAX_SIZE,
  DEFAULT_CACHE_TTL,
  DEFAULT_DOC_MAX_CHARS,
  DEFAULT_LIST_LIMIT,
  DEFAULT_SEARCH_LIMIT,
  DEFAULT_TIMEOUT,
  ROOTAGE_ENDPOINTS,
  SEED_DOCS_BASE_URL,
} from "./constants.js";
import {
  getSectionDocTxtUrl,
  getSectionOverviewTxtUrl,
  isValidCategory,
  isValidSection,
  SECTION_IDS,
  SECTIONS,
  type SectionId,
} from "./config.js";
import type { DocInfo, RootageIndex, SearchDocResult } from "./types.js";

const DOC_LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
const DOC_PATH_PATTERN = /^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/;
const LLM_DOC_PATH_PATTERN = /^\/llms\/[a-z0-9-]+\/[a-z0-9-/]+\.txt$/;
const OVERVIEW_PATH_PATTERN = /^\/[a-z0-9-]+\/llms\.txt$/;

type CacheValue = string | number | boolean | object;

const cache = new LRUCache<string, CacheValue>({
  max: 256,
  ttl: DEFAULT_CACHE_TTL,
  maxSize: DEFAULT_CACHE_MAX_SIZE,
  sizeCalculation(value) {
    if (typeof value === "string") {
      return value.length;
    }
    return JSON.stringify(value).length;
  },
  updateAgeOnGet: true,
});

const inflightRequests = new Map<string, Promise<unknown>>();

function withTimeout(timeoutMs = DEFAULT_TIMEOUT): AbortSignal {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  controller.signal.addEventListener(
    "abort",
    () => {
      clearTimeout(timeoutId);
    },
    { once: true },
  );
  return controller.signal;
}

function isSeedDocsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.origin === SEED_DOCS_BASE_URL;
  } catch {
    return false;
  }
}

function isLlmsTextUrl(url: string): boolean {
  if (!isSeedDocsUrl(url)) {
    return false;
  }

  const { pathname } = new URL(url);
  return LLM_DOC_PATH_PATTERN.test(pathname) || OVERVIEW_PATH_PATTERN.test(pathname);
}

function assertLlmsTextUrl(url: string): void {
  if (!isLlmsTextUrl(url)) {
    throw new Error(`Invalid llms.txt URL: ${url}`);
  }
}

function assertTextResponse(contentType: string | null, url: string): void {
  const normalized = contentType?.toLowerCase() ?? "";

  if (normalized.includes("text/html")) {
    throw new Error(`HTML response is not allowed for docs-mcp: ${url}`);
  }

  if (!normalized || normalized.startsWith("text/")) {
    return;
  }

  throw new Error(`Expected text response but received '${contentType ?? "unknown"}' from ${url}`);
}

function assertJsonResponse(contentType: string | null, url: string): void {
  const normalized = contentType?.toLowerCase() ?? "";
  if (normalized.includes("application/json") || normalized.endsWith("+json")) {
    return;
  }
  throw new Error(`Expected JSON response but received '${contentType ?? "unknown"}' from ${url}`);
}

async function fetchWithCache<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  opts?: { skipCache?: boolean },
): Promise<T> {
  if (!opts?.skipCache) {
    const cached = cache.get(cacheKey);
    if (cached !== undefined) {
      return cached as T;
    }
  }

  const inflight = inflightRequests.get(cacheKey);
  if (inflight) {
    return (await inflight) as T;
  }

  const requestPromise = (async () => {
    const data = await fetcher();
    cache.set(cacheKey, data as CacheValue);
    return data;
  })();

  inflightRequests.set(cacheKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inflightRequests.delete(cacheKey);
  }
}

async function fetchText(url: string): Promise<{ content: string; contentType: string }> {
  const response = await fetch(url, { signal: withTimeout(DEFAULT_TIMEOUT) });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  assertTextResponse(contentType, url);

  const content = await response.text();
  return {
    content,
    contentType: contentType ?? "text/plain",
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { signal: withTimeout(DEFAULT_TIMEOUT) });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  assertJsonResponse(contentType, url);

  return (await response.json()) as T;
}

function normalizeDocPath(path: string): string {
  const cleanPath = path.replace(/\.txt$/, "").replace(/^\/+/, "");
  if (!DOC_PATH_PATTERN.test(cleanPath)) {
    throw new Error(`Invalid document path: ${path}`);
  }
  return cleanPath;
}

function createFallbackTitle(path: string): string {
  const segment = path.split("/").at(-1) ?? path;
  return segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseDocsFromOverview(section: SectionId, overviewText: string): DocInfo[] {
  const docs: DocInfo[] = [];
  const basePath = `${SECTIONS[section].basePath}/`;

  for (const line of overviewText.split("\n")) {
    const matches = [...line.matchAll(DOC_LINK_PATTERN)];
    if (matches.length === 0) {
      continue;
    }

    for (const match of matches) {
      const [, titleFromLink, txtUrl] = match;
      if (!txtUrl || !txtUrl.startsWith(SEED_DOCS_BASE_URL)) {
        continue;
      }

      if (!isLlmsTextUrl(txtUrl)) {
        continue;
      }

      const parsedUrl = new URL(txtUrl);
      if (!parsedUrl.pathname.startsWith(basePath) || !parsedUrl.pathname.endsWith(".txt")) {
        continue;
      }

      const relativePath = parsedUrl.pathname.slice(basePath.length, -4);
      if (!DOC_PATH_PATTERN.test(relativePath)) {
        continue;
      }

      const category = relativePath.includes("/") ? relativePath.split("/")[0] : undefined;
      docs.push({
        title: titleFromLink || createFallbackTitle(relativePath),
        path: relativePath,
        txtUrl,
        category,
      });
    }
  }

  const deduped = new Map<string, DocInfo>();
  for (const doc of docs) {
    deduped.set(doc.path, doc);
  }
  return Array.from(deduped.values());
}

function truncateContent(
  content: string,
  maxChars: number,
): { content: string; truncated: boolean } {
  if (content.length <= maxChars) {
    return { content, truncated: false };
  }
  return {
    content: content.slice(0, maxChars),
    truncated: true,
  };
}

function scoreDoc(query: string, doc: DocInfo): number {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  const title = doc.title.toLowerCase();
  const path = doc.path.toLowerCase();
  let score = 0;

  for (const token of tokens) {
    if (title.includes(token)) {
      score += 3;
    }
    if (path.includes(token)) {
      score += 2;
    }
  }

  if (title.includes(query.toLowerCase())) {
    score += 2;
  }
  if (path.includes(query.toLowerCase())) {
    score += 1;
  }

  return score;
}

export async function fetchSectionOverview(section: SectionId): Promise<string> {
  const overviewUrl = getSectionOverviewTxtUrl(section);
  assertLlmsTextUrl(overviewUrl);
  return fetchWithCache<string>(overviewUrl, async () => {
    const { content } = await fetchText(overviewUrl);
    return content;
  });
}

export async function fetchDocsList(
  section: SectionId,
  opts?: { category?: string; limit?: number },
): Promise<{ items: DocInfo[]; total: number; truncated: boolean }> {
  if (opts?.category && !isValidCategory(section, opts.category)) {
    throw new Error(`Invalid category '${opts.category}' for section '${section}'`);
  }

  const overview = await fetchSectionOverview(section);
  const docs = parseDocsFromOverview(section, overview);
  const filtered = opts?.category ? docs.filter((doc) => doc.category === opts.category) : docs;
  const limit = Math.max(1, opts?.limit ?? DEFAULT_LIST_LIMIT);
  const items = filtered.slice(0, limit);

  return {
    items,
    total: filtered.length,
    truncated: filtered.length > items.length,
  };
}

export async function fetchDoc(
  section: SectionId,
  path: string,
  maxChars = DEFAULT_DOC_MAX_CHARS,
): Promise<{ txtUrl: string; content: string; contentType: string; truncated: boolean }> {
  const cleanPath = normalizeDocPath(path);
  const txtUrl = getSectionDocTxtUrl(section, cleanPath);

  assertLlmsTextUrl(txtUrl);

  const data = await fetchWithCache<{ content: string; contentType: string }>(txtUrl, async () =>
    fetchText(txtUrl),
  );

  const truncated = truncateContent(data.content, Math.max(1, maxChars));

  return {
    txtUrl,
    content: truncated.content,
    contentType: data.contentType,
    truncated: truncated.truncated,
  };
}

export async function searchDocs(
  query: string,
  opts?: {
    section?: SectionId;
    category?: string;
    limit?: number;
  },
): Promise<{ results: SearchDocResult[]; total: number; truncated: boolean }> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return { results: [], total: 0, truncated: false };
  }

  const targetSections: SectionId[] = opts?.section ? [opts.section] : SECTION_IDS;
  const results: SearchDocResult[] = [];

  for (const section of targetSections) {
    if (!isValidSection(section)) {
      continue;
    }
    const list = await fetchDocsList(section, { category: opts?.category });
    for (const doc of list.items) {
      const score = scoreDoc(normalizedQuery, doc);
      if (score <= 0) {
        continue;
      }
      results.push({
        section,
        title: doc.title,
        path: doc.path,
        txtUrl: doc.txtUrl,
        category: doc.category,
        score,
      });
    }
  }

  results.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));

  const limit = Math.max(1, opts?.limit ?? DEFAULT_SEARCH_LIMIT);
  return {
    results: results.slice(0, limit),
    total: results.length,
    truncated: results.length > limit,
  };
}

function normalizeRootagePath(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath.includes("..")) {
    throw new Error(`Invalid rootage path: ${path}`);
  }
  return cleanPath;
}

export async function fetchRootageIndex(): Promise<RootageIndex> {
  const indexUrl = `${SEED_DOCS_BASE_URL}${ROOTAGE_ENDPOINTS.INDEX}`;
  return fetchWithCache<RootageIndex>(indexUrl, async () => fetchJson<RootageIndex>(indexUrl));
}

export async function fetchRootageResource(path: string): Promise<unknown> {
  const rootagePath = normalizeRootagePath(path);
  const resourceUrl = `${SEED_DOCS_BASE_URL}${ROOTAGE_ENDPOINTS.BASE}${rootagePath}`;
  return fetchWithCache<unknown>(resourceUrl, async () => fetchJson<unknown>(resourceUrl));
}

export function clearCache(): void {
  cache.clear();
  inflightRequests.clear();
}

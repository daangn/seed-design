import { LRUCache } from "lru-cache";
import { SEED_DOCS_BASE_URL, ROOTAGE_ENDPOINTS } from "./constants.js";
import { SECTIONS, type SectionId } from "./config.js";
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

  const response = await fetch(url);

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

export async function fetchSectionOverview(section: SectionId): Promise<string> {
  const config = SECTIONS[section];
  return fetchWithCache<string>(`${SEED_DOCS_BASE_URL}${config.overviewPath}`);
}

export async function fetchSectionFull(section: SectionId): Promise<string> {
  const config = SECTIONS[section];
  return fetchWithCache<string>(`${SEED_DOCS_BASE_URL}${config.fullPath}`);
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function fetchDocsList(section: SectionId, category?: string): Promise<DocInfo[]> {
  const overview = await fetchSectionOverview(section);
  const config = SECTIONS[section];

  const lines = overview.split("\n").filter((line) => line.trim());
  const docs: DocInfo[] = [];

  const escapedBasePath = escapeRegExp(config.basePath);
  const urlPattern = new RegExp(`${escapedBasePath}\\/([a-z0-9-/]+)\\.txt`, "i");

  for (const line of lines) {
    const match = line.match(urlPattern);
    if (!match) continue;

    const path = match[1];
    const pathParts = path.split("/");
    const docCategory = pathParts.length > 1 ? pathParts[0] : undefined;

    if (category && docCategory !== category) continue;

    const titleMatch = line.match(/\[([^\]]+)\]/);
    const title = titleMatch
      ? titleMatch[1]
      : pathParts[pathParts.length - 1]
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

    const urlMatch = line.match(/\((https?:\/\/[^)]+)\)/);
    const url = urlMatch ? urlMatch[1] : `${SEED_DOCS_BASE_URL}${config.basePath}/${path}.txt`;

    docs.push({
      title,
      path,
      url,
      category: docCategory,
    });
  }

  return docs;
}

export async function fetchDoc(section: SectionId, path: string): Promise<string> {
  const config = SECTIONS[section];
  const cleanPath = path.replace(/\.txt$/, "");
  return fetchWithCache<string>(`${SEED_DOCS_BASE_URL}${config.basePath}/${cleanPath}.txt`);
}

export interface RootageIndex {
  name: string;
  version: string;
  resources: Array<{ path: string }>;
}

export async function fetchRootageIndex(): Promise<RootageIndex> {
  return fetchWithCache<RootageIndex>(`${SEED_DOCS_BASE_URL}${ROOTAGE_ENDPOINTS.INDEX}`);
}

export async function fetchRootageResource(path: string): Promise<unknown> {
  return fetchWithCache<unknown>(`${SEED_DOCS_BASE_URL}${ROOTAGE_ENDPOINTS.BASE}${path}`);
}

export function clearCache(): void {
  cache.clear();
}

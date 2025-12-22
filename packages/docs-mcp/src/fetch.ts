import { LRUCache } from "lru-cache";
import type { ComponentInfo, FoundationInfo } from "./types.js";

// Base URL for SEED Design documentation
const SEED_BASE_URL = "https://seed-design.io";

// LRU Cache for documentation content with automatic eviction
const cache = new LRUCache<string, any>({
  max: 100, // Maximum 100 items
  ttl: 5 * 60 * 1000, // 5 minutes TTL
  maxSize: 50 * 1024 * 1024, // 50MB maximum memory
  sizeCalculation: (value) => {
    // Calculate size based on JSON string length
    return JSON.stringify(value).length;
  },
  updateAgeOnGet: true, // Refresh TTL on access
});

/**
 * Generic fetch utility with caching and error handling
 */
async function fetchWithCache<T>(url: string, errorContext?: string): Promise<T> {
  // Check cache first
  const cached = cache.get(url);
  if (cached) {
    return cached as T;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const context = errorContext || `fetch ${url}`;
      throw new Error(`Failed to ${context}: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    let data: T;

    if (contentType?.includes("application/json")) {
      data = (await response.json()) as T;
    } else {
      data = (await response.text()) as T;
    }

    // Update cache
    cache.set(url, data);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to fetch ${url}: Unknown error`);
  }
}

/**
 * Fetches the list of React components
 */
export async function fetchReactComponentList(): Promise<ComponentInfo[]> {
  const content = await fetchWithCache<string>(
    `${SEED_BASE_URL}/react/llms-components.txt`,
    "fetch React components list",
  );

  // Parse the component list from the text content
  const lines = content.split("\n").filter((line) => line.trim());
  const components: ComponentInfo[] = [];

  for (const line of lines) {
    const match = line.match(/llms-components\/([a-z-]+)\.txt/);
    if (match) {
      const name = match[1];
      const titleMatch = line.match(/\[([^\]]+)\]/);
      const title = titleMatch
        ? titleMatch[1]
        : name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
      components.push({ name, title });
    }
  }

  return components;
}

/**
 * Fetches the documentation for a specific React component
 */
export async function fetchReactComponent(componentName: string): Promise<string> {
  return fetchWithCache<string>(
    `${SEED_BASE_URL}/react/llms-components/${componentName}.txt`,
    `fetch React component ${componentName}`,
  );
}

/**
 * Fetches the React changelog
 */
export async function fetchReactChangelog(): Promise<string> {
  return fetchWithCache<string>(
    `${SEED_BASE_URL}/react/llms-changelog.txt`,
    "fetch React changelog",
  );
}

/**
 * Fetches the list of Breeze components
 */
export async function fetchBreezeComponentList(): Promise<ComponentInfo[]> {
  const content = await fetchWithCache<string>(
    `${SEED_BASE_URL}/breeze/llms.txt`,
    "fetch Breeze components list",
  );

  // Parse the component list from the text content
  const lines = content.split("\n").filter((line) => line.trim());
  const components: ComponentInfo[] = [];

  for (const line of lines) {
    const match = line.match(/llms\/components\/([a-z-]+)\.txt/);
    if (match) {
      const name = match[1];
      const titleMatch = line.match(/\[([^\]]+)\]/);
      const title = titleMatch
        ? titleMatch[1]
        : name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
      components.push({ name, title });
    }
  }

  return components;
}

/**
 * Fetches the documentation for a specific Breeze component
 */
export async function fetchBreezeComponent(componentName: string): Promise<string> {
  return fetchWithCache<string>(
    `${SEED_BASE_URL}/breeze/llms/components/${componentName}.txt`,
    `fetch Breeze component ${componentName}`,
  );
}

/**
 * Fetches the list of docs components (design guidelines)
 */
export async function fetchDocsComponentList(): Promise<ComponentInfo[]> {
  const content = await fetchWithCache<string>(
    `${SEED_BASE_URL}/docs/llms-components.txt`,
    "fetch docs components list",
  );

  // Parse the component list from the text content
  const lines = content.split("\n").filter((line) => line.trim());
  const components: ComponentInfo[] = [];

  for (const line of lines) {
    // Extract component names from URLs like /docs/llms-components/action-button.txt
    const match = line.match(/llms-components\/([a-z-]+)\.txt/);
    if (match) {
      const name = match[1];
      // Extract title from markdown link like [Action Button](...)
      const titleMatch = line.match(/\[([^\]]+)\]/);
      const title = titleMatch
        ? titleMatch[1]
        : name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
      components.push({ name, title });
    }
  }

  return components;
}

/**
 * Fetches the documentation for a specific docs component (design guideline)
 */
export async function fetchDocsComponent(componentName: string): Promise<string> {
  return fetchWithCache<string>(
    `${SEED_BASE_URL}/docs/llms-components/${componentName}.txt`,
    `fetch docs component ${componentName}`,
  );
}

/**
 * Fetches the list of foundation topics
 */
export async function fetchFoundationList(): Promise<FoundationInfo[]> {
  const content = await fetchWithCache<string>(
    `${SEED_BASE_URL}/docs/llms-foundation.txt`,
    "fetch foundation list",
  );

  // Parse the foundation list from the text content
  const lines = content.split("\n").filter((line) => line.trim());
  const foundations: FoundationInfo[] = [];

  for (const line of lines) {
    // Extract topic paths from URLs like /docs/llms-foundation/spacing.txt or /docs/llms-foundation/color/palette.txt
    const match = line.match(/llms-foundation\/([a-z-/]+)\.txt/);
    if (match) {
      const path = match[1];
      const parts = path.split("/");
      const name = path;
      const category = parts.length > 1 ? parts[0] : undefined;
      // Extract title from markdown link like [Color Palette](...)
      const titleMatch = line.match(/\[([^\]]+)\]/);
      const title = titleMatch
        ? titleMatch[1]
        : parts[parts.length - 1]
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
      foundations.push({ name, title, category });
    }
  }

  return foundations;
}

/**
 * Fetches the documentation for a specific foundation topic
 */
export async function fetchFoundation(topic: string): Promise<string> {
  return fetchWithCache<string>(
    `${SEED_BASE_URL}/docs/llms-foundation/${topic}.txt`,
    `fetch foundation topic ${topic}`,
  );
}

/**
 * Rootage index.json structure
 */
export interface RootageIndex {
  name: string;
  version: string;
  resources: Array<{ path: string }>;
}

/**
 * Fetches the rootage index (list of all available resources)
 */
export async function fetchRootageIndex(): Promise<RootageIndex> {
  return fetchWithCache<RootageIndex>(`${SEED_BASE_URL}/rootage/index.json`, "fetch rootage index");
}

/**
 * Fetches a specific rootage resource by path
 * @param path - Resource path from index.json (e.g., '/color.json', '/components/action-button.json')
 */
export async function fetchRootageResource(path: string): Promise<unknown> {
  return fetchWithCache<unknown>(
    `${SEED_BASE_URL}/rootage${path}`,
    `fetch rootage resource ${path}`,
  );
}

/**
 * Clear the cache
 */
export function clearCache(): void {
  cache.clear();
}

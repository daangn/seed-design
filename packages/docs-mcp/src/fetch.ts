import { LRUCache } from "lru-cache";
import type { ComponentInfo } from "./types.js";

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
    // Extract component names from URLs or list items
    const match = line.match(/llms-components\/([a-z-]+)\.txt/) || line.match(/^-?\s*([a-z-]+)/i);
    if (match) {
      const name = match[1];
      components.push({
        name,
        title: name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      });
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
    const match = line.match(/llms\/components\/([a-z-]+)\.txt/) || line.match(/^-?\s*([a-z-]+)/i);
    if (match) {
      const name = match[1];
      components.push({
        name,
        title: name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      });
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
 * Clear the cache
 */
export function clearCache(): void {
  cache.clear();
}

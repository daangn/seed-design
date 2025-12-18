export const SEED_DOCS_BASE_URL = "https://seed-design.io";

export const DOCS_ENDPOINTS = {
  // React documentation endpoints
  REACT_OVERVIEW: "/react/llms.txt",
  REACT_COMPONENTS_LIST: "/react/llms-components.txt",
  REACT_COMPONENTS: "/react/llms-components",
  REACT_CHANGELOG: "/react/llms-changelog.txt",
  REACT_FULL: "/react/llms-full.txt",

  // Docs documentation endpoints (Design Guidelines)
  DOCS_OVERVIEW: "/docs/llms.txt",
  DOCS_COMPONENTS_LIST: "/docs/llms-components.txt",
  DOCS_COMPONENTS: "/docs/llms-components",
  DOCS_FOUNDATION_LIST: "/docs/llms-foundation.txt",
  DOCS_FOUNDATION: "/docs/llms-foundation",

  // Sitemap
  SITEMAP: "/sitemap.xml",
} as const;

export const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

export const DEFAULT_TIMEOUT = 30000; // 30 seconds

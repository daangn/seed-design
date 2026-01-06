export const SEED_DOCS_BASE_URL = "https://seed-design.io";

export const DOCS_ENDPOINTS = {
  // React documentation endpoints
  REACT_OVERVIEW: "/react/llms.txt",
  REACT_COMPONENTS_LIST: "/react/llms-components.txt",
  REACT_COMPONENTS: "/react/llms-components",
  REACT_CHANGELOG: "/react/llms-changelog.txt",
  REACT_FULL: "/react/llms-full.txt",

  // React section endpoints
  REACT_GETTING_STARTED_LIST: "/react/llms-getting-started.txt",
  REACT_GETTING_STARTED: "/react/llms-getting-started",
  REACT_STACKFLOW_LIST: "/react/llms-stackflow.txt",
  REACT_STACKFLOW: "/react/llms-stackflow",
  REACT_DEVELOPER_TOOLS_LIST: "/react/llms-developer-tools.txt",
  REACT_DEVELOPER_TOOLS: "/react/llms-developer-tools",
  REACT_MIGRATION_LIST: "/react/llms-migration.txt",
  REACT_MIGRATION: "/react/llms-migration",
  REACT_AI_INTEGRATION_LIST: "/react/llms-ai-integration.txt",
  REACT_AI_INTEGRATION: "/react/llms-ai-integration",
  REACT_UPDATES_LIST: "/react/llms-updates.txt",
  REACT_UPDATES: "/react/llms-updates",

  // Docs documentation endpoints (Design Guidelines)
  DOCS_OVERVIEW: "/docs/llms.txt",
  DOCS_COMPONENTS_LIST: "/docs/llms-components.txt",
  DOCS_COMPONENTS: "/docs/llms-components",
  DOCS_FOUNDATION_LIST: "/docs/llms-foundation.txt",
  DOCS_FOUNDATION: "/docs/llms-foundation",

  // Rootage (Design Tokens & Component Specs)
  ROOTAGE_INDEX: "/rootage/index.json",
  ROOTAGE_BASE: "/rootage",

  // Sitemap
  SITEMAP: "/sitemap.xml",
} as const;

export const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

export const DEFAULT_TIMEOUT = 30000; // 30 seconds

export const SEED_DOCS_BASE_URL = "https://seed-design.io";

export const ROOTAGE_ENDPOINTS = {
  INDEX: "/rootage/index.json",
  BASE: "/rootage",
} as const;

export const ICON_ENDPOINTS = {
  INDEX: "/icon-index.json",
  SVG_BASE: "/icons",
} as const;

export const DEFAULT_TIMEOUT = 30_000;
export const DEFAULT_CACHE_TTL = 5 * 60 * 1_000;
export const DEFAULT_CACHE_MAX_SIZE = 50 * 1024 * 1024;
export const DEFAULT_LIST_LIMIT = 100;
export const DEFAULT_SEARCH_LIMIT = 20;
export const DEFAULT_DOC_MAX_CHARS = 32_000;

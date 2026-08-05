export const SEED_DOCS_BASE_URL = "https://seed-design.io";

/**
 * Machine-readable map of every documentation section, generated from the docs
 * site's section registry. Read at runtime so an installed copy of this server
 * follows structure changes without a release.
 */
export const DOCS_INDEX_ENDPOINT = "/__docs__/index.json";

export const ROOTAGE_ENDPOINTS = {
  INDEX: "/rootage/index.json",
  BASE: "/rootage",
} as const;

export const ICON_ENDPOINTS = {
  INDEX: "/icon-index.json",
  SVG_BASE: "/icons",
} as const;

export const DEFAULT_TIMEOUT = 30000;

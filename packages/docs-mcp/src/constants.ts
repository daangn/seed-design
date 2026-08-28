/**
 * The docs site this server reads. `SEED_DOCS_BASE_URL` points it at a local docs server
 * or an archived site, the counterpart to the CLI's `--baseUrl`. MCP clients pass env
 * through their server config, so this needs no tool argument.
 */
export const SEED_DOCS_BASE_URL = process.env.SEED_DOCS_BASE_URL || "https://seed-design.io";

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

/** Caps every request: a docs site that hangs would otherwise hang the MCP client too. */
export const DEFAULT_TIMEOUT = 30000;

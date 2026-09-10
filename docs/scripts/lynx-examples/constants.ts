import { resolve } from "node:path";

export const LYNX_MANIFEST_SCHEMA_VERSION = 1 as const;
export const LYNX_CACHE_SCHEMA_VERSION = 1 as const;
export const LYNX_WEB_CORE_STYLES_FILENAME = "web-core.css";

export const DOCS_DIRECTORY = resolve(import.meta.dir, "../..");
export const REPOSITORY_DIRECTORY = resolve(DOCS_DIRECTORY, "..");
export const EXAMPLES_DIRECTORY = resolve(DOCS_DIRECTORY, "examples/lynx");
export const STAGING_DIRECTORY = resolve(DOCS_DIRECTORY, ".next/lynx-rspeedy-dist");
export const DEVELOPMENT_DIRECTORY = resolve(DOCS_DIRECTORY, ".next/lynx-rspeedy-dev-dist");
export const PUBLIC_DIRECTORY = resolve(DOCS_DIRECTORY, "public/__lynx__");
export const CACHE_DIRECTORY = resolve(DOCS_DIRECTORY, ".next/cache/lynx-rspeedy");

export const LYNX_TOOL_VERSIONS = {
  rspeedy: "0.16.3",
  reactRsbuildPlugin: "0.18.3",
  configRsbuildPlugin: "0.2.2",
  react: "0.123.3",
  types: "4.1.0",
  webCore: "0.24.0",
  webElements: "0.12.7",
  lynxCore: "0.1.4",
  cssSerializer: "0.1.7",
} as const;

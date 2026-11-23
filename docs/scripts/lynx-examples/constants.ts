import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const LYNX_MANIFEST_SCHEMA_VERSION = 1 as const;
export const LYNX_E2E_MANIFEST_SCHEMA_VERSION = 1 as const;
export const LYNX_E2E_MANIFEST_FILENAME = "e2e-manifest.json";
export const LYNX_CACHE_SCHEMA_VERSION = 2 as const;
export const LYNX_WEB_CORE_STYLES_FILENAME = "web-core.css";
const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));

export const DOCS_DIRECTORY = resolve(SCRIPT_DIRECTORY, "../..");
export const REPOSITORY_DIRECTORY = resolve(DOCS_DIRECTORY, "..");
export const EXAMPLES_DIRECTORY = resolve(DOCS_DIRECTORY, "examples/lynx");
export const STAGING_DIRECTORY = resolve(DOCS_DIRECTORY, ".cache/lynx-rspeedy-dist");
export const DEVELOPMENT_DIRECTORY = resolve(DOCS_DIRECTORY, ".cache/lynx-rspeedy-dev-dist");
export const PUBLIC_DIRECTORY = resolve(DOCS_DIRECTORY, "public/__lynx__");
export const CACHE_DIRECTORY = resolve(DOCS_DIRECTORY, ".cache/lynx-rspeedy");
/** 문서 render가 JSON module로 import하는 manifest 사본(`lib/lynx-examples/manifest.ts`). */
export const BUILD_DATA_MANIFEST_PATH = resolve(
  DOCS_DIRECTORY,
  ".cache/build-data/lynx-manifest.json",
);

export const LYNX_TOOL_VERSIONS = {
  rspeedy: "0.18.1",
  reactRsbuildPlugin: "0.20.4",
  configRsbuildPlugin: "0.2.5",
  react: "0.125.0",
  types: "4.1.0",
  webCore: "0.26.7",
  webElements: "0.12.17",
  lynxCore: "0.1.4",
  cssSerializer: "0.1.9",
} as const;

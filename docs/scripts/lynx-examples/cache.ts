import { LYNX_CACHE_SCHEMA_VERSION, LYNX_TOOL_VERSIONS } from "./constants.js";
import type { LynxExampleEntry } from "./discovery.js";

export function createLynxCacheDigest(entries: LynxExampleEntry[]) {
  return [
    `schema:${LYNX_CACHE_SCHEMA_VERSION}`,
    ...entries
      .toSorted((a, b) => a.id.localeCompare(b.id))
      .flatMap(({ id, entryKey }) => [id, entryKey]),
    "environments:web,lynx",
    ...Object.entries(LYNX_TOOL_VERSIONS).map(([name, version]) => `${name}:${version}`),
  ];
}

import { resolve } from "node:path";
import { DOCS_DIRECTORY, EXAMPLES_DIRECTORY } from "./constants.js";
import type { LynxExampleEntry } from "./discovery.js";

const VIRTUAL_ENTRIES_DIRECTORY = resolve(DOCS_DIRECTORY, ".next/lynx-entries");
const STANDALONE_MODULE = resolve(EXAMPLES_DIRECTORY, "standalone.tsx");

export interface StandaloneModules {
  entries: Record<string, string>;
  modules: Record<string, string>;
}

export function createStandaloneModules(entries: LynxExampleEntry[]): StandaloneModules {
  const standaloneEntries: Record<string, string> = {};
  const modules: Record<string, string> = {};

  for (const entry of [...entries].sort((a, b) => a.id.localeCompare(b.id))) {
    const virtualPath = resolve(VIRTUAL_ENTRIES_DIRECTORY, `${entry.entryKey}.tsx`);
    standaloneEntries[entry.entryKey] = virtualPath;
    modules[virtualPath] = [
      `import { renderLynxExample } from ${JSON.stringify(STANDALONE_MODULE)};`,
      `import Example from ${JSON.stringify(entry.sourcePath)};`,
      "",
      "renderLynxExample(Example);",
      "",
    ].join("\n");
  }

  return { entries: standaloneEntries, modules };
}

export function createCatalogModule(entries: LynxExampleEntry[]): string {
  const items = [...entries]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((entry) => {
      const [component, scenario] = entry.entryKey.split("/");
      return [
        "  {",
        `    id: ${JSON.stringify(entry.id)},`,
        `    component: ${JSON.stringify(component)},`,
        `    scenario: ${JSON.stringify(scenario)},`,
        `    load: () => import(${JSON.stringify(entry.sourcePath)}),`,
        "  },",
      ].join("\n");
    });

  return [
    'import type { LynxPlaygroundExample } from "./types";',
    "",
    "export const examples = [",
    ...items,
    "] as const satisfies readonly LynxPlaygroundExample[];",
    "",
  ].join("\n");
}

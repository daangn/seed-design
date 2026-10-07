import { resolve } from "node:path";
import { getExampleLayout } from "../../playground/lynx/layout.js";
import { DOCS_DIRECTORY, EXAMPLES_DIRECTORY } from "./constants.js";
import type { LynxExampleEntry } from "./discovery.js";

const VIRTUAL_ENTRIES_DIRECTORY = resolve(DOCS_DIRECTORY, ".next/lynx-entries");
const STANDALONE_MODULE = resolve(EXAMPLES_DIRECTORY, "standalone.tsx");

export interface StandaloneModules {
  entries: Record<string, string>;
  modules: Record<string, string>;
}

/** 같은 컴포넌트의 예제는 bundle 하나를 공유한다. bundle 이름(entry key)은 컴포넌트 디렉터리 이름이다. */
export function getLynxExampleBundleKey(entry: Pick<LynxExampleEntry, "entryKey">): string {
  return entry.entryKey.slice(0, entry.entryKey.indexOf("/"));
}

export function createStandaloneModules(entries: LynxExampleEntry[]): StandaloneModules {
  const groups = new Map<string, LynxExampleEntry[]>();
  for (const entry of [...entries].sort((a, b) => a.id.localeCompare(b.id))) {
    const bundleKey = getLynxExampleBundleKey(entry);
    groups.set(bundleKey, [...(groups.get(bundleKey) ?? []), entry]);
  }

  const standaloneEntries: Record<string, string> = {};
  const modules: Record<string, string> = {};
  for (const [bundleKey, group] of groups) {
    const virtualPath = resolve(VIRTUAL_ENTRIES_DIRECTORY, `${bundleKey}.tsx`);
    standaloneEntries[bundleKey] = virtualPath;
    modules[virtualPath] = [
      `import { renderLynxExamples } from ${JSON.stringify(STANDALONE_MODULE)};`,
      ...group.map(
        (entry, index) => `import Example${index} from ${JSON.stringify(entry.sourcePath)};`,
      ),
      "",
      "renderLynxExamples({",
      ...group.map(
        (entry, index) =>
          `  ${JSON.stringify(entry.id)}: { Example: Example${index}, layout: ${JSON.stringify(getExampleLayout(entry.id))} },`,
      ),
      "});",
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

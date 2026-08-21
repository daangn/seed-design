import { lstat, readdir, realpath } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { EXAMPLES_DIRECTORY } from "./constants.js";

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface LynxExampleEntry {
  id: `lynx/${string}/${string}`;
  entryKey: `${string}/${string}`;
  sourcePath: string;
}

function assertInsideDirectory(path: string, directory: string) {
  const pathFromRoot = relative(directory, path);
  if (
    pathFromRoot === ".." ||
    pathFromRoot.startsWith(`..${sep}`) ||
    pathFromRoot.startsWith(sep)
  ) {
    throw new Error(`Lynx 예제 경로가 루트 밖을 가리킵니다: ${path}`);
  }
}

export async function discoverLynxExamples(
  examplesDirectory = EXAMPLES_DIRECTORY,
): Promise<LynxExampleEntry[]> {
  const root = await realpath(examplesDirectory);
  const entries: LynxExampleEntry[] = [];
  const seenIds = new Map<string, string>();
  const seenCaseInsensitiveIds = new Map<string, string>();

  for (const componentEntry of await readdir(root, { withFileTypes: true })) {
    const componentPath = resolve(root, componentEntry.name);
    if (componentEntry.isSymbolicLink() || (await lstat(componentPath)).isSymbolicLink()) {
      throw new Error(`Lynx 예제에는 symlink를 사용할 수 없습니다: ${componentPath}`);
    }
    if (!componentEntry.isDirectory()) continue;
    if (!KEBAB_CASE.test(componentEntry.name)) {
      throw new Error(`Lynx 컴포넌트 디렉터리는 kebab-case여야 합니다: ${componentEntry.name}`);
    }

    for (const scenarioEntry of await readdir(componentPath, { withFileTypes: true })) {
      const scenarioPath = resolve(componentPath, scenarioEntry.name);
      if (scenarioEntry.isSymbolicLink() || (await lstat(scenarioPath)).isSymbolicLink()) {
        throw new Error(`Lynx 예제에는 symlink를 사용할 수 없습니다: ${scenarioPath}`);
      }
      if (!scenarioEntry.isFile() || !scenarioEntry.name.endsWith(".tsx")) continue;

      const scenario = scenarioEntry.name.slice(0, -4);
      if (!KEBAB_CASE.test(scenario)) {
        throw new Error(`Lynx 시나리오 파일은 kebab-case여야 합니다: ${scenarioEntry.name}`);
      }

      const resolvedSource = await realpath(scenarioPath);
      assertInsideDirectory(resolvedSource, root);
      const entryKey = `${componentEntry.name}/${scenario}` as const;
      const id = `lynx/${entryKey}` as const;
      const lowerId = id.toLowerCase();
      const duplicate = seenIds.get(id) ?? seenCaseInsensitiveIds.get(lowerId);
      if (duplicate) {
        throw new Error(`중복되거나 대소문자만 다른 Lynx 예제 ID입니다: ${id} (${duplicate})`);
      }
      seenIds.set(id, resolvedSource);
      seenCaseInsensitiveIds.set(lowerId, resolvedSource);
      entries.push({ id, entryKey, sourcePath: resolvedSource });
    }
  }

  return entries.sort((a, b) => a.id.localeCompare(b.id));
}

export function toRspeedyEntries(entries: LynxExampleEntry[]): Record<string, string> {
  return Object.fromEntries(entries.map((entry) => [entry.entryKey, entry.sourcePath]));
}

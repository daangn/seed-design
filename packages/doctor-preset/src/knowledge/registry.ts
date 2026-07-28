import { fetchJson, mapWithConcurrency, type FetchImpl } from "./fetch";
import type { DeprecatedComponent, DeprecatedSnippetItem, SnippetItem } from "./types";

interface RegistryIndexEntry {
  id?: string;
}

interface RegistryItem {
  id?: string;
  deprecated?: boolean;
  snippets?: Array<{ path?: string; dependencies?: Record<string, string> }>;
}

interface Registry {
  id?: string;
  items?: RegistryItem[];
}

/** 설치 시 확장자가 변형될 수 있는 스니펫 경로 후보 (compat의 getSnippetPathCandidates와 동일 규칙) */
function snippetPathCandidates(path: string): string[] {
  const candidates = [path];
  if (path.endsWith(".tsx")) candidates.push(path.replace(/\.tsx$/, ".jsx"));
  else if (path.endsWith(".ts")) candidates.push(path.replace(/\.ts$/, ".js"));
  return candidates;
}

/**
 * registry 아티팩트에서 deprecated 스니펫 아이템을 수집한다.
 * rootage에 같은 id의 컴포넌트가 있으면 그 대체 안내 문구를 이어받는다.
 */
export async function loadRegistryKnowledge({
  baseUrl,
  framework,
  deprecatedComponents = [],
  fetchImpl = fetch,
}: {
  baseUrl: string;
  framework: string;
  deprecatedComponents?: DeprecatedComponent[];
  fetchImpl?: FetchImpl;
}): Promise<{ deprecatedSnippetItems: DeprecatedSnippetItem[]; snippetItems: SnippetItem[] }> {
  const registryIndex = (await fetchJson(
    `${baseUrl}/__registry__/${framework}/index.json`,
    fetchImpl,
  )) as RegistryIndexEntry[];

  const registryIds = (Array.isArray(registryIndex) ? registryIndex : [])
    .map((entry) => entry.id)
    .filter((id): id is string => typeof id === "string");

  const registries = await mapWithConcurrency(registryIds, async (registryId) => {
    return (await fetchJson(
      `${baseUrl}/__registry__/${framework}/${registryId}/index.json`,
      fetchImpl,
    )) as Registry;
  });

  const messageByComponentId = new Map(
    deprecatedComponents.map((component) => [component.id, component.message]),
  );

  const deprecatedSnippetItems: DeprecatedSnippetItem[] = [];
  const snippetItems: SnippetItem[] = [];

  for (const registry of registries) {
    if (!registry.id || !Array.isArray(registry.items)) continue;

    for (const item of registry.items) {
      if (!item.id) continue;

      const snippets = item.snippets ?? [];
      const snippetPaths = snippets
        .map((snippet) => snippet.path)
        .filter((path): path is string => typeof path === "string")
        .flatMap(snippetPathCandidates);

      // 아이템 내 스니펫들은 같은 세대에서 생성되므로 요구 범위가 동일하다. 첫 선언을 대표로 쓴다.
      const requires = snippets.find((snippet) => snippet.dependencies)?.dependencies ?? {};

      snippetItems.push({ registryId: registry.id, itemId: item.id, snippetPaths, requires });

      if (item.deprecated === true) {
        deprecatedSnippetItems.push({
          registryId: registry.id,
          itemId: item.id,
          snippetPaths,
          message: messageByComponentId.get(item.id),
        });
      }
    }
  }

  return { deprecatedSnippetItems, snippetItems };
}

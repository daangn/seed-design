import { fetchJson, type FetchImpl } from "./fetch";

interface DocsIndex {
  categories?: Array<{
    id?: string;
    sections?: Array<{ id?: string; items?: Array<{ id?: string }> }>;
  }>;
}

/**
 * 디자인 가이드라인 문서가 존재하는 컴포넌트 id 집합.
 *
 * 가이드라인이 없는 컴포넌트에 검토 룰을 만들면 404 링크가 나가고, 에이전트는 읽을 게
 * 없어 아무것도 판정하지 못한다. 그래서 문서가 있는 것만 대상으로 삼는다 —
 * **가이드라인을 쓰면 그 컴포넌트의 검토가 켜진다.**
 *
 * 인덱스를 못 가져오면 빈 집합을 반환한다(= 검토 룰 0개, 조용히 침묵). 진단 전체를
 * 실패시키지 않는다.
 */
export async function loadGuidelineDocIds({
  baseUrl,
  fetchImpl = fetch,
}: {
  baseUrl: string;
  fetchImpl?: FetchImpl;
}): Promise<Set<string>> {
  let index: DocsIndex;
  try {
    index = (await fetchJson(`${baseUrl}/__docs__/index.json`, fetchImpl)) as DocsIndex;
  } catch {
    return new Set();
  }

  // 프레임워크 무관한 디자인 문서는 "docs"(Design) 카테고리의 "components" 섹션에 있다.
  const items =
    index.categories
      ?.find((category) => category.id === "docs")
      ?.sections?.find((section) => section.id === "components")?.items ?? [];

  return new Set(items.map((item) => item.id).filter((id): id is string => typeof id === "string"));
}

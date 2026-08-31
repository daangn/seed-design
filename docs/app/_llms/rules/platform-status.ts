import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../../../sanity-studio/env";
import { ALL_COMPONENTS_QUERY } from "../../../sanity-studio/lib/queries";
import type { ComponentData, PlatformStatus } from "../../../sanity-studio/lib/types";
import { PLATFORM_CONFIG, PLATFORM_STATUS_LABELS } from "../../../lib/platform-status";
import { escapeCell, markdownRow } from "./markdown-utils";

// 룰이 아니라 마크다운 헬퍼다. 그래서 `-rule` 접미사를 쓰지 않는다.
//
// 컴포넌트 문서 페이지엔 본문 <PlatformStatusTable> 노드가 없다(플랫폼 상태를 헤더에서 렌더).
// 그래서 이 파일은 llms.txt 조립 시 상태 테이블을 주입하기 위한 마크다운 헬퍼만 제공한다
// (get-llm-text.ts에서 호출). MDX 노드를 변환하던 규칙은 더 이상 매칭 대상이 없어 제거했다.

const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn: false });

type Row = Record<string, string>;

const columnDefs: { key: string; header: string }[] = [
  { key: "platform", header: "Platform" },
  { key: "status", header: "Status" },
  { key: "note", header: "Note" },
];

/**
 * 컴포넌트 하나의 플랫폼 상태 테이블을 만든다. Note 열은 어느 플랫폼에도 note가 없으면 통째로 빠진다.
 */
export function generateMarkdownTable(component: ComponentData): string {
  const rows: Row[] = PLATFORM_CONFIG.map(({ key, label }) => {
    const status = component[`${key}Status`] as PlatformStatus;
    const url = component[`${key}Url`] as string | undefined;
    const note = component[`${key}Note`] as string | undefined;

    return {
      platform: url ? `[${label}](${escapeCell(url)})` : label,
      status: PLATFORM_STATUS_LABELS[status] ?? "Not Ready",
      note: note ? escapeCell(note) : "",
    };
  });

  const activeColumns = columnDefs.filter(({ key }) => rows.some((row) => row[key]));

  return [
    markdownRow(activeColumns.map((col) => col.header)),
    markdownRow(activeColumns.map(() => "---")),
    ...rows.map((row) => markdownRow(activeColumns.map((col) => row[col.key]))),
  ].join("\n");
}

let componentDataCache: Map<string, ComponentData> | null = null;
let initPromise: Promise<void> | null = null;

async function fetchAndCacheComponentData(): Promise<void> {
  const cache = new Map<string, ComponentData>();
  try {
    const components = await sanityClient.fetch<ComponentData[]>(ALL_COMPONENTS_QUERY);
    for (const component of components) {
      cache.set(component.id, component);
    }
  } catch {
    // Sanity fetch 실패 시 빈 캐시 사용
  }
  componentDataCache = cache;
}

async function init(): Promise<void> {
  if (!initPromise) {
    initPromise = fetchAndCacheComponentData();
  }
  await initPromise;
}

/**
 * componentIds의 각 컴포넌트에 대한 플랫폼 상태 마크다운 테이블을 만든다.
 * 2개 이상이면 각 테이블 앞에 `### 컴포넌트이름` 헤딩을 붙여 구분한다(list, manner-temp).
 * 문서가 없는 id는 건너뛰고, 하나도 없으면 빈 문자열을 반환한다.
 */
export async function getPlatformStatusMarkdown(componentIds: string[]): Promise<string> {
  await init();
  const showHeading = componentIds.length > 1;
  const parts = componentIds
    .map((id) => componentDataCache?.get(id))
    .filter((component): component is ComponentData => Boolean(component))
    .map((component) =>
      showHeading
        ? `### ${component.name}\n\n${generateMarkdownTable(component)}`
        : generateMarkdownTable(component),
    );
  return parts.join("\n\n");
}

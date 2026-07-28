import type { Reference } from "@seed-design/doctor-core";

/**
 * 룰이 참조하는 문서 URL. 전부 llms.txt 라우트라 사람도 에이전트도 그대로 읽을 수 있다.
 * 이 목록이 곧 "사용자가 무엇을 읽어야 하는지"의 단일 출처다.
 */
export function docsReference(baseUrl: string, path: string, title: string): Reference {
  return { title, url: `${baseUrl}/llms/${path}.txt` };
}

export const REFERENCE_PATHS = {
  deprecations: "docs/migration/deprecations",
  upgradeV2: "react/updates/upgrade/v2",
  upgradeV1: "react/updates/upgrade/v1",
  cliCommands: "react/getting-started/cli/commands",
  /** 컴포넌트별 React API 문서 */
  reactComponent: (id: string) => `react/components/${id}`,
  /** 컴포넌트별 디자인 가이드라인 (Do/Dont 포함) */
  componentGuideline: (id: string) => `components/${id}`,
} as const;

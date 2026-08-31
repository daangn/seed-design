import { sectionConfigs, sections } from "@/app/_llms/config";
import { baseUrl } from "@/app/metadata";

export const revalidate = false;

/**
 * 섹션이 아니라서 레지스트리에 없지만 표에는 있어야 하는 진입점.
 * (패키지/버전별로 갈라지는 changelog는 `/llms/react/updates/` 아래 별도 라우트다)
 */
const EXTRA_ROWS = [
  {
    label: "Changelog",
    llms: "/llms/react/updates/changelog.txt",
    description: "패키지별/버전별 변경 이력",
  },
];

export async function GET() {
  // 레지스트리에서 생성한다. 손으로 적으면 섹션을 추가할 때마다 여기가 빠진다 —
  // foundations/components/patterns/updates가 실제로 그렇게 누락됐었다.
  const rows = [
    ...sections.map((section) => {
      const config = sectionConfigs[section];
      return {
        label: config.label,
        llms: `${config.baseUrl}/llms.txt`,
        description: config.description,
      };
    }),
    ...EXTRA_ROWS,
  ]
    .map(
      ({ label, llms, description }) =>
        `| ${label} | [llms.txt](${new URL(llms, baseUrl)}) | ${description} |`,
    )
    .join("\n");

  return new Response(`# SEED Design System - Documentation for LLMs

SEED는 당근의 디자인 시스템입니다.

## Documentation Sections

| 섹션 | 진입점 | 설명 |
|------|--------|------|
${rows}
`);
}

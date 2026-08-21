import { getLLMMarkdownUrl, sectionConfigs, shouldIncludeInFullText } from "@/app/_llms/config";
import { getDisplayTitle } from "@/app/_llms/utils";
import { baseUrl } from "@/app/metadata";
import { getFoundationsSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const foundationsSource = await getFoundationsSource();
  // 섹션 인덱스는 sectionConfigs.excludePaths가 이미 걸러준다.
  const pages = foundationsSource
    .getPages()
    .filter((page) => shouldIncludeInFullText("foundations", page.path));

  // color/iconography/design-token 탭 그룹의 index는 모두 title이 "Overview"라
  // 그대로 나열하면 구분이 안 된다. getDisplayTitle이 slug로 꼬리표를 붙여준다.
  // 정렬은 title이 아니라 slug 기준 — 그래야 탭 그룹의 하위 문서가 부모 옆에 붙는다.
  const pageList = pages
    .sort((a, b) => a.slugs.join("/").localeCompare(b.slugs.join("/")))
    .map((page) => {
      const displayTitle = getDisplayTitle(page, pages);
      const llmsUrl = new URL(getLLMMarkdownUrl("foundations", page.slugs), baseUrl);
      const description = page.data.description ? `: ${page.data.description}` : "";
      return `- [${displayTitle}](${llmsUrl})${description}`;
    })
    .join("\n");

  return new Response(`# SEED Foundations - LLM Reference

${sectionConfigs.foundations.description}

## Documents

${pageList}

## Related Sections

- [Components](${new URL("/components/llms.txt", baseUrl)}): 컴포넌트 디자인 스펙
- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리
`);
}

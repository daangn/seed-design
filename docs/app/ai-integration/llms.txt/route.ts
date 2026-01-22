import { baseUrl } from "@/app/metadata";
import type { LLMPage } from "@/app/_llms/types";
import { aiIntegrationSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = (aiIntegrationSource.getPages() as LLMPage[]).filter(
    (page) => page.slugs.length > 0,
  );

  const pageList = pages
    .map((page) => {
      const slugsWithExt = page.slugs.map((s, i) => (i === page.slugs.length - 1 ? `${s}.txt` : s));
      const llmsUrl = new URL(`/llms/ai-integration/${slugsWithExt.join("/")}`, baseUrl);
      return `- [${page.data.title}](${llmsUrl}): ${page.data.description ?? ""}`;
    })
    .sort()
    .join("\n");

  return new Response(`# SEED Design AI Integration - LLM Reference

AI 도구와 SEED Design을 함께 활용하는 방법을 안내합니다.

## Quick Access

- [전체 문서 (llms-full.txt)](${new URL("/ai-integration/llms-full.txt", baseUrl)}): 모든 AI Integration 문서를 하나의 파일로

## Documents

${pageList}

## Usage

개별 페이지는 /llms/ai-integration/{path}.txt 형태로 접근할 수 있습니다.

예시:
- ${new URL("/llms/ai-integration/figma-mcp.txt", baseUrl)}
- ${new URL("/llms/ai-integration/docs-mcp.txt", baseUrl)}
- ${new URL("/llms/ai-integration/llms-txt.txt", baseUrl)}

## Related Sections

- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리
- [Design Guidelines](${new URL("/docs/llms.txt", baseUrl)}): 디자인 가이드라인
- [Breeze Utilities](${new URL("/breeze/llms.txt", baseUrl)}): 유틸리티 UI 컴포넌트
`);
}

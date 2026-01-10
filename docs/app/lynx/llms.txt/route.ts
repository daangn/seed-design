import { baseUrl } from "@/app/metadata";
import type { LLMPage } from "@/app/_llms/types";
import { lynxSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = (lynxSource.getPages() as LLMPage[]).filter((page) => page.slugs.length > 0);

  const pageList = pages
    .map((page) => {
      const slugsWithExt = page.slugs.map((s, i) => (i === page.slugs.length - 1 ? `${s}.txt` : s));
      const llmsUrl = new URL(`/llms/lynx/${slugsWithExt.join("/")}`, baseUrl);
      return `- [${page.data.title}](${llmsUrl}): ${page.data.description ?? ""}`;
    })
    .sort()
    .join("\n");

  return new Response(`# SEED Design Lynx - LLM Reference

Lynx 프레임워크 문서입니다.

## Quick Access

- [전체 문서 (llms-full.txt)](${new URL("/lynx/llms-full.txt", baseUrl)}): 모든 Lynx 문서를 하나의 파일로

## Documents

${pageList}

## Usage

개별 페이지는 /llms/lynx/{path}.txt 형태로 접근할 수 있습니다.

예시:
- ${new URL("/llms/lynx/icon.txt", baseUrl)}

## Related Sections

- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리
- [AI Integration](${new URL("/ai-integration/llms.txt", baseUrl)}): AI 도구 연동 가이드
`);
}

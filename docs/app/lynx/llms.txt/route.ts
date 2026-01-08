import { baseUrl } from "@/app/metadata";
import { lynxSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = lynxSource.getPages();

  const pageList = pages
    .filter(({ slugs }) => slugs.length > 0 && slugs[0] !== "index")
    .map(({ data, slugs }) => {
      const path = slugs.join("/");
      return `- [${data.title}](${new URL(`/lynx/${path}`, baseUrl)}): ${data.description || ""}`;
    })
    .join("\n");

  return new Response(`# SEED Design Lynx - LLM Reference

Lynx는 SEED Design의 프레임워크입니다.

## Available Documents

${pageList}

## Related Sections

- [Design Guidelines](${new URL("/docs/llms.txt", baseUrl)}): 컴포넌트 디자인 가이드라인
- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리
- [Breeze Utilities](${new URL("/breeze/llms.txt", baseUrl)}): 유틸리티 UI 컴포넌트
- [AI Integration](${new URL("/ai-integration/llms.txt", baseUrl)}): AI 도구 연동 가이드

## Notes

- Lynx 문서는 아이콘 및 UI 프레임워크 사용법을 다룹니다.
- AI 도구와 함께 사용하는 방법은 AI Integration 섹션을 참고하세요.`);
}

import { baseUrl } from "@/app/metadata";
import { aiIntegrationSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = aiIntegrationSource.getPages();

  const pageList = pages
    .filter(({ slugs }) => slugs.length > 0 && slugs[0] !== "index")
    .map(({ data, slugs }) => {
      const path = slugs.join("/");
      return `- [${data.title}](${new URL(`/ai-integration/${path}`, baseUrl)}): ${data.description || ""}`;
    })
    .join("\n");

  return new Response(`# SEED Design AI Integration - LLM Reference

AI 도구와 SEED Design을 함께 활용하는 방법을 안내합니다.

## Available Documents

${pageList}

## Related Sections

- [Design Guidelines](${new URL("/docs/llms.txt", baseUrl)}): 컴포넌트 디자인 가이드라인
- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리
- [Breeze Utilities](${new URL("/breeze/llms.txt", baseUrl)}): 유틸리티 UI 컴포넌트
- [Lynx](${new URL("/lynx/llms.txt", baseUrl)}): Lynx 프레임워크

## Notes

- MCP(Model Context Protocol)를 통해 Figma 디자인을 React 코드로 변환할 수 있습니다.
- llms.txt를 통해 AI 어시스턴트에게 SEED Design 문서를 컨텍스트로 제공할 수 있습니다.`);
}

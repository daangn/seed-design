import { baseUrl } from "@/app/metadata";

export const revalidate = false;

export async function GET() {
  return new Response(`# SEED Design - Documentation for LLMs

SEED Design은 당근마켓의 디자인 시스템입니다.
이 문서는 대규모 언어 모델(LLM)이 SEED Design을 쉽게 이해할 수 있도록 구조화되어 있습니다.

## Documentation Sections

각 섹션별 llms.txt 진입점을 제공합니다.

| 섹션 | 진입점 | 설명 |
|------|--------|------|
| Design Guidelines | [llms.txt](${new URL("/docs/llms.txt", baseUrl)}) | 컴포넌트 디자인 가이드라인, Foundation |
| React Library | [llms.txt](${new URL("/react/llms.txt", baseUrl)}) | React 컴포넌트 라이브러리, API 레퍼런스 |
| Breeze Utilities | [llms.txt](${new URL("/breeze/llms.txt", baseUrl)}) | 유틸리티 UI 컴포넌트 |
| Lynx | [llms.txt](${new URL("/lynx/llms.txt", baseUrl)}) | Lynx 프레임워크 |
| AI Integration | [llms.txt](${new URL("/ai-integration/llms.txt", baseUrl)}) | AI 도구 연동 가이드 |

## Individual Page Access

개별 페이지는 /llms/{section}/{path} 형태로 접근할 수 있습니다.

예시:
- ${new URL("/llms/react/components/button.txt", baseUrl)} - Button 컴포넌트 문서
- ${new URL("/llms/docs/foundation/color.txt", baseUrl)} - Color Foundation 문서
- ${new URL("/llms/ai-integration/figma-mcp.txt", baseUrl)} - Figma MCP 문서

## Notes

- 모든 문서는 seed-design.io의 공식 문서와 동기화됩니다.`);
}

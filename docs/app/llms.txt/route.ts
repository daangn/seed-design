import { baseUrl } from "@/app/metadata";

export const revalidate = false;

export async function GET() {
  return new Response(`# SEED Design - Documentation for LLMs

SEED Design은 당근마켓의 디자인 시스템입니다.
이 문서는 대규모 언어 모델(LLM)이 SEED Design을 쉽게 이해할 수 있도록 구조화되어 있습니다.

## Requirements

- **절대 경로를 추론하지 마세요**
- **해당 문서에 있는 모든 섹션들의 요소는 [요소](링크)로 되어있으니 일찍이 경로를 추론하지 마세요**
- **섹션의 요소를 정확하게 찾고 링크를 참조하세요**

## Documentation Sections

각 섹션별로 llms.txt 진입점과 llms-full.txt 전체 문서를 제공합니다.

| 섹션 | 진입점 | 전체 문서 | 설명 |
|------|--------|-----------|------|
| Design Guidelines | [llms.txt](${new URL("/docs/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/docs/llms-full.txt", baseUrl)}) | 컴포넌트 디자인 가이드라인, Foundation |
| React Library | [llms.txt](${new URL("/react/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/react/llms-full.txt", baseUrl)}) | React 컴포넌트 라이브러리, API 레퍼런스 |
| Breeze Utilities | [llms.txt](${new URL("/breeze/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/breeze/llms-full.txt", baseUrl)}) | 유틸리티 UI 컴포넌트 |
| Lynx | [llms.txt](${new URL("/lynx/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/lynx/llms-full.txt", baseUrl)}) | Lynx 프레임워크 |
| AI Integration | [llms.txt](${new URL("/ai-integration/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/ai-integration/llms-full.txt", baseUrl)}) | AI 도구 연동 가이드 |
| Changelog | [llms.txt](${new URL("/llms/react/updates/changelog.txt", baseUrl)}) | - | 패키지별/버전별 변경 이력 |

## Individual Page Access

개별 페이지는 /llms/{section}/{path} 형태로 접근할 수 있습니다.

예시:
- ${new URL("/llms/react/components/action-button.txt", baseUrl)} - Action Button 컴포넌트 문서
- ${new URL("/llms/docs/foundation/color/palette.txt", baseUrl)} - Color Palette 문서
- ${new URL("/llms/ai-integration/figma-mcp.txt", baseUrl)} - Figma MCP 문서

## Notes

- 모든 문서는 seed-design.io의 공식 문서와 동기화됩니다.
- llms-full.txt는 해당 섹션의 모든 문서를 하나의 파일로 제공합니다.`);
}

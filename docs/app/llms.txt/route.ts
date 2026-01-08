import { baseUrl } from "@/app/metadata";

export const revalidate = false;

export async function GET() {
  return new Response(`# SEED Design - Documentation for LLMs

SEED Design은 당근마켓의 디자인 시스템입니다.
이 문서는 대규모 언어 모델(LLM)이 SEED Design을 쉽게 이해할 수 있도록 구조화되어 있습니다.

## Documentation Sections

각 섹션별로 llms.txt 진입점을 제공합니다.

- [Design Guidelines](${new URL("/docs/llms.txt", baseUrl)}): 컴포넌트 디자인 가이드라인, Foundation (색상, 타이포그래피, 간격 등)
- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리, API 레퍼런스, 사용 예제
- [Breeze Utilities](${new URL("/breeze/llms.txt", baseUrl)}): 프로젝트에 바로 사용할 수 있는 유틸리티 UI 컴포넌트
- [Lynx](${new URL("/lynx/llms.txt", baseUrl)}): Lynx 프레임워크
- [AI Integration](${new URL("/ai-integration/llms.txt", baseUrl)}): MCP, llms.txt 활용법 등 AI 도구 연동 가이드

## Quick Access

자주 사용되는 문서에 빠르게 접근할 수 있습니다.

- [Full React documentation](${new URL("/react/llms-full.txt", baseUrl)}): React 라이브러리의 모든 문서
- [Component Guidelines](${new URL("/docs/llms-components.txt", baseUrl)}): 디자인 가이드라인 문서 진입점
- [Foundation](${new URL("/docs/llms-foundation.txt", baseUrl)}): 색상, 타이포그래피, 간격 등 기초 토큰

## Notes

- 모든 문서는 seed-design.io의 공식 문서와 동기화됩니다.
- 각 섹션의 llms.txt에서 상세 문서로 접근할 수 있습니다.
- React 섹션에서는 llms-full.txt를 통해 모든 문서를 한 번에 확인할 수 있습니다.`);
}

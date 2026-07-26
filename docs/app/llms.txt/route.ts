import { baseUrl } from "@/app/metadata";

export const revalidate = false;

export async function GET() {
  return new Response(`# SEED Design System - Documentation for LLMs

SEED는 당근의 디자인 시스템입니다.

## Documentation Sections

| 섹션 | 진입점 | 전체 문서 | 설명 |
|------|--------|-----------|------|
| Get Started | [llms.txt](${new URL("/get-started/llms.txt", baseUrl)}) | - | SEED가 무엇이고 어디서부터 보면 되는지 (본문 1장) |
| Foundations | [llms.txt](${new URL("/foundations/llms.txt", baseUrl)}) | - | 색상, 타이포그래피, 간격 등 디자인 파운데이션 |
| Components | [llms.txt](${new URL("/components/llms.txt", baseUrl)}) | - | 컴포넌트 디자인 스펙 (Anatomy, Properties, Guidelines) |
| Patterns | [llms.txt](${new URL("/patterns/llms.txt", baseUrl)}) | - | 디자인 패턴 및 가이드라인 |
| Design Guidelines | [llms.txt](${new URL("/docs/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/docs/llms-full.txt", baseUrl)}) | 마이그레이션 등 디자인 참고 문서 |
| React Library | [llms.txt](${new URL("/react/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/react/llms-full.txt", baseUrl)}) | React 컴포넌트 라이브러리, API 레퍼런스 |
| Breeze Utilities | [llms.txt](${new URL("/breeze/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/breeze/llms-full.txt", baseUrl)}) | 유틸리티 UI 컴포넌트 |
| Lynx | [llms.txt](${new URL("/lynx/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/lynx/llms-full.txt", baseUrl)}) | Lynx 프레임워크 |
| AI Integration | [llms.txt](${new URL("/ai-integration/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/ai-integration/llms-full.txt", baseUrl)}) | AI 도구 연동 가이드 |
| Updates | [llms.txt](${new URL("/updates/llms.txt", baseUrl)}) | - | SEED 업데이트 소식과 릴리스 노트 |
| Changelog | [llms.txt](${new URL("/llms/react/updates/changelog.txt", baseUrl)}) | - | 패키지별/버전별 변경 이력 |
`);
}

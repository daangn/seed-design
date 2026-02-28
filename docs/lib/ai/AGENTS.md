# docs/lib/ai

## 디렉토리 개요

문서 사이트 AI 서버 로직 계층, 시스템 프롬프트/도구 정의/MCP 연동/의도 감지 담당

## 파일 작성 컨벤션

- 계약(`tool-contract.ts`), 도구(`tools.ts`), 프롬프트(`system-prompt.ts`), 의도 감지(`component-guide-intent.ts`) 파일 단위 분리
- 테스트: 대상 파일과 같은 경로 `*.test.ts`
- 네트워크/외부 연동 로직(`mcp-client.ts`, `sitemap-links.ts`)은 UI 코드와 분리

## 코드 작성 컨벤션

- 새 툴 추가 시 `tools.ts` 스키마/execute, `tool-contract.ts` 정책, 관련 테스트 동시 갱신
- 입력은 정규화/검증 후 처리, 실패 시 가능한 폴백 결과 반환
- 환경변수 의존성(`LLM_ROUTER_*`, `SEED_DOCS_MCP_SERVER_URL`) 변경 시 `.env.example` 동기화

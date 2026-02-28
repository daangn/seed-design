# docs/lib/ai

## 디렉토리 개요

문서 사이트 AI 서버 로직 계층, 시스템 프롬프트/도구 정의/MCP 연동/의도 감지 담당
Agent 런타임의 기술 상세(오케스트레이션/승인/폴백)는 `docs/TECH.md`를 우선 참고한다.

## 파일 작성 컨벤션

- 계약(`tool-contract.ts`), 도구(`tools.ts`), 프롬프트(`system-prompt.ts`), 의도 감지(`component-guide-intent.ts`) 파일 단위 분리
- 오케스트레이션(`orchestrator.ts`), 에이전트 구성(`agent.ts`), 툴 메타데이터(`tool-registry.ts`)를 분리 유지
- 테스트: 대상 파일과 같은 경로 `*.test.ts`
- 네트워크/외부 연동 로직(`mcp-client.ts`, `component-guide-links.ts`, `llms-props.ts`)은 UI 코드와 분리

## 코드 작성 컨벤션

- 새 툴 추가 시 수정 지점:
  - client tool: `tools.ts` + `CLIENT_TOOL_DESCRIPTORS`
  - MCP tool 정책: `tool-registry.ts` (descriptor/approval policy)
  - 프롬프트 컨텍스트: `system-prompt.ts`
  - 오케스트레이션 분기: `orchestrator.ts`, `agent.ts`
  - 렌더링/억제 회귀: `tool-contract.ts` 관련 테스트
- 입력은 정규화/검증 후 처리, 실패 시 가능한 폴백 결과 반환
- 환경변수 의존성(`LLM_ROUTER_*`, `SEED_DOCS_MCP_SERVER_URL`) 변경 시 `.env.example` 동기화

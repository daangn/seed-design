# Docs TECH

## AI Agent Runtime 아키텍처

`docs/app/api/chat/handle-chat-request.ts`는 요청마다 다음 런타임 파이프라인으로 동작한다.
실행 진입점은 `docs/functions/api/chat.ts`(Cloudflare Pages Functions)이며, API 경로는 `/api/chat`를 유지한다.

1. `safeValidateUIMessages`로 입력 메시지 검증
2. `tool-registry` 기반으로 client tool + MCP tool 카탈로그 구성
3. 복잡 질문만 `orchestrator`에서 계획(2단계) 생성
4. `buildSystemPrompt`로 런타임 컨텍스트(툴 카탈로그/링크/계획) 주입
5. `ToolLoopAgent` 실행 후 `createAgentUIStreamResponse`로 UI 스트림 반환

## Tool Descriptor 스키마와 Capability 분류 규칙

파일: `docs/lib/ai/tool-registry.ts`

- `ToolDescriptor` 필드
  - `name`: 툴 이름
  - `source`: `client | mcp`
  - `capability`: `discover | search | fetch | preview | install | code | types | mutation | other`
  - `risk`: `low | medium | high`
  - `uiHint`: `generic | preview | code | table | install`
  - `approvalPolicy`: `auto | on-high-risk | always`
- 분류 기본값
  - 이름/설명 기반 추론을 사용
  - client tool은 명시 descriptor를 우선
  - MCP tool은 추론 descriptor를 기본 적용

## 툴 승인(Approval) 정책 매트릭스

기준 파일: `docs/lib/ai/tool-registry.ts`

| approvalPolicy | 동작 |
|---|---|
| `auto` | 승인 없이 실행 |
| `on-high-risk` | `risk === high`일 때만 승인 필요 |
| `always` | 항상 승인 필요 |

기본 정책은 read-only 툴 자동 승인이다. `mutation` 성격 툴은 `high`로 분류되어 승인 경로를 탄다.

## 스트리밍 메시지 파트 계약 (UIMessage parts/data parts)

- 서버 출력 형식: `createAgentUIStreamResponse` 기반 UIMessage 스트림
- UI는 `message.parts`를 신뢰하고 `dynamic-tool`, `tool-*`, `text`를 처리한다.
- 툴 결과가 전용 렌더러를 갖지 않아도 범용 카드로 표시된다.
- `messageMetadata`에는 검증된 링크와 오케스트레이션 요약이 포함될 수 있다.

## MCP 연결 수명주기 (open/tools/close)

파일: `docs/lib/ai/mcp-client.ts`

1. 기본 경로: `@ai-sdk/mcp`의 `createMCPClient({ transport: { type: "http", url } })`
2. 툴 조회: `listTools` + `toolsFromDefinitions`
3. 종료: 요청 완료 시 `close()`
4. 장애 시: 레거시 JSON-RPC 클라이언트로 폴백 가능

## 신규 툴 추가 체크리스트

1. 툴 구현/연동
   - client tool: `docs/lib/ai/tools.ts`
   - MCP tool: MCP 서버 쪽 구현 + `mcp-client.ts` 연동 확인
2. descriptor 등록/확인
   - client tool은 `CLIENT_TOOL_DESCRIPTORS`에 명시
   - MCP tool은 추론 결과 검토 후 필요 시 override
3. 승인 정책
   - 위험도와 `approvalPolicy`가 기대와 일치하는지 확인
4. UI 출력
   - 전용 렌더러가 필요하면 `tool-result-renderer.tsx` 확장
   - 없으면 범용 카드로 최소 표시 확인
5. 테스트
   - `tool-registry`, `tools`, `system-prompt`, 렌더러 테스트 보강

## 장애/폴백 런북

### MCP SDK 경로 실패

- 증상: `createMCPClient` 또는 `listTools` 예외
- 대응:
  1. 서버 로그에서 오류 확인
  2. `getMCPToolBundle`의 legacy fallback 경로로 자동 전환 여부 확인
  3. fallback도 실패하면 MCP 툴 없이 client tool만으로 응답

### 오케스트레이터 실패

- 증상: 계획 생성 실패
- 대응:
  - `generateOrchestrationPlan`은 heuristic fallback을 반환하므로 스트리밍은 계속 진행

### 텍스트 과억제

- 증상: 텍스트가 거의 사라지고 툴만 노출
- 대응:
  - `tool-contract.ts` 억제 regex 확인
  - `chat-message.tsx`의 fenced code 제거 로직이 텍스트를 함께 지우지 않는지 확인

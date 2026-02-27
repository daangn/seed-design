# packages/mcp

## 디렉토리 개요

**Figma MCP(Model Context Protocol) 서버**. LLM이 Figma 디자인 데이터를 조회·편집하고 코드를 생성할 수 있도록 MCP 도구를 제공한다. 데이터 수신은 REST API와 WebSocket 이중 경로를 지원하지만, 양쪽 모두 REST 포맷 데이터를 반환하므로 **`createRestNormalizer`만 사용**한다.

데이터 흐름 (normalize가 필요한 도구):
- REST 경로: REST API → `createRestNormalizer` → normalized → codegen
- WebSocket 경로: Plugin `exportAsync({ format: "JSON_REST_V1" })` → WebSocket → `createRestNormalizer` → normalized → codegen

### ToolMode

`ToolMode`(`rest` | `websocket` | `all`)에 따라 등록되는 도구와 파라미터 스키마가 달라진다.

| 모드 | 조건 | 등록되는 도구 |
|------|------|---------------|
| `rest` | REST API만 사용 | hybrid 도구 + utility 도구 |
| `websocket` | WebSocket만 사용 | hybrid 도구 + utility 도구 + WebSocket 전용 도구 |
| `all` | 양쪽 모두 | 전체 도구 |

### 도구 카테고리

도구는 4가지 카테고리로 나뉜다. 개별 도구 목록은 `src/tools.ts` 참고.

- **Hybrid 도구**: REST + WebSocket 양쪽 지원. normalize가 필요한 도구는 `createRestNormalizer` 사용
- **Utility 도구**: Figma 연결 불필요
- **WebSocket 전용 도구**: `websocket` | `all` 모드에서만 등록
- **편집 도구**: WebSocket 필수, `registerEditingTools`로 별도 등록

## 파일 작성 컨벤션

- `src/tools.ts`: MCP 도구 정의 및 핸들러 (`registerTools`, `registerEditingTools`)
- `src/tools-helpers.ts`: 도구 공통 헬퍼 (`fetchNodeData`, `fetchMultipleNodesData`, `ToolMode`)
- `src/figma-rest-client.ts`: Figma REST API 클라이언트
- `src/websocket.ts`: Figma Plugin WebSocket 클라이언트
- `src/responses.ts`: 응답 포맷팅 유틸리티
- `src/prompts.ts`: LLM 프롬프트 템플릿
- `src/config.ts`: MCP 설정 (`McpConfig`)
- `src/bin/`: 실행 엔트리포인트

## 코드 작성 컨벤션

- `packages/figma`의 `createRestNormalizer`, `figma`(codegen), `react`(codegen)를 import해서 사용
- `createPluginNormalizer`는 사용하지 않는다 — Plugin 환경이 아니므로 Plugin API 호출 불가
- 도구 파라미터는 `ToolMode`에 따라 스키마가 동적으로 결정됨 (`getSingleNodeParamsSchema`, `getMultiNodeParamsSchema`)

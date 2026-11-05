# packages/mcp

Figma 데이터를 조회·편집하고 코드를 생성하는 Figma MCP 서버(`@seed-design/mcp`)다. REST API와 Figma Plugin WebSocket 두 경로로 데이터를 받지만 둘 다 REST 포맷을 반환하므로 정규화는 `packages/figma`의 `createRestNormalizer` 하나로 한다.

## 검증

- `bun --filter @seed-design/mcp build`. `packages/figma`를 함께 고쳤으면 `bun --filter @seed-design/figma build`를 먼저 실행한다.
- hybrid 도구를 추가·수정함 → `seed-verify-figma-mcp-transports` Skill로 REST와 WebSocket 결과를 실제로 비교한다. 비교 실행기는 `bun packages/mcp/scripts/probe-transports.ts --probe <tool> --transport both --file-key <key> --node-id <id>`다. 한쪽만 고쳐도 타입은 통과하고 다른 쪽이 조용히 어긋난다.
- WebSocket 확인에는 Figma 데스크톱 앱 조작이 필요하다. 코드를 읽고 "맞을 것"으로 갈음하지 않는다 → 사람이 할 단계를 사용자에게 요청하고, 끝내지 못하면 미검증으로 보고한다.

## 규칙

### 경로와 도구 등록

- WebSocket 경로는 Plugin `exportAsync({ format: "JSON_REST_V1" })` 결과를 받는다. 이 서버는 Plugin 환경이 아니므로 `createPluginNormalizer`와 Plugin API를 쓰지 않는다 → 두 경로 모두 `createRestNormalizer`로 정규화한 뒤 `@seed-design/figma`의 `figma`·`react` codegen으로 넘긴다.
- `src/tools-helpers.ts`의 `ToolMode`(`rest` | `websocket` | `all`, 기본 `all`)가 등록 도구와 파라미터 schema를 정한다. hybrid·utility 도구는 모든 모드, WebSocket 전용 도구는 `websocket`·`all`에서만 등록한다. 개별 도구 목록은 `src/tools.ts`에 있다.
- 노드 파라미터 schema는 `src/tools.ts`의 `getSingleNodeParamsSchema`·`getMultiNodeParamsSchema`로 만든다. 도구마다 따로 정의하지 않는다.
- 편집 도구는 `registerEditingTools`로 따로 등록한다. `--experimental`이 있고, 모드가 `rest`가 아니며, WebSocket client가 있을 때만 등록된다(`src/bin/index.ts`).
- REST 인증은 `FIGMA_PERSONAL_ACCESS_TOKEN` 환경변수로 한다(`src/bin/index.ts`).

### 경로별 차이 표시

- WebSocket에만 있는 필드(`labelMarkdown`, `category` 등) → `src/tools-helpers.ts`의 `ToolAnnotation`처럼 optional로 두고 REST가 왜 못 주는지 타입 옆 주석에 쓴다.
- 같은 개념을 두 경로가 다른 이름으로 부름(페이지: Plugin `PAGE`, REST `CANVAS`) → 같은 방식으로 타입 옆에 남긴다.

### 개발 스크립트

- `scripts/`는 `package.json`의 `files`에 없어 배포되지 않는다. 새 hybrid 도구를 비교 대상에 넣으려면 `scripts/probe-transports.ts`의 `PROBES`에 항목을 추가한다.

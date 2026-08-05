---
"@seed-design/mcp": major
"@seed-design/docs-mcp": minor
---

MCP TypeScript SDK를 v1(`@modelcontextprotocol/sdk`)에서 v2(`@modelcontextprotocol/server`)로 마이그레이션합니다.

MCP 서버로만 사용한다면(`bunx @seed-design/mcp`, `npx @seed-design/docs-mcp`) 달라지는 것은 없습니다. 도구 목록과 파라미터, 프로토콜 리비전(`2025-11-25`) 모두 그대로입니다.

패키지를 직접 import해서 커스텀 MCP 서버에 통합하는 경우에만 영향이 있습니다.

- `registerTools`(`@seed-design/mcp`)와 `initializeTools`, `server`(`@seed-design/docs-mcp`)가 다루는 `McpServer`의 출처가 `@modelcontextprotocol/sdk`에서 `@modelcontextprotocol/server`로 바뀝니다. v1으로 만든 `McpServer`는 더 이상 넘길 수 없으므로, 함께 v2로 옮겨야 합니다.
- `@modelcontextprotocol/server`를 직접 설치해야 합니다. 마이그레이션은 [공식 가이드](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/upgrade-to-v2.md)의 코드모드로 대부분 자동 처리됩니다.
- v2는 Node.js 20 이상, zod 4.2 이상을 요구합니다. zod 4.2 미만에서는 설치와 타입 검사가 통과하더라도 도구 설명이 사라지거나 첫 `tools/list`에서 실패합니다.
- `SSEServerTransport`는 v2에서 제거되었습니다. Streamable HTTP를 사용하세요.

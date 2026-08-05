---
"@seed-design/mcp": major
"@seed-design/docs-mcp": minor
---

MCP TypeScript SDK를 v1(`@modelcontextprotocol/sdk`)에서 v2(`@modelcontextprotocol/server`)로 마이그레이션합니다.

- 두 패키지를 MCP 서버로만 사용하는 경우(`bunx @seed-design/mcp`, `npx @seed-design/docs-mcp` 등) 달라지는 것은 없습니다.
- 패키지를 직접 import해서 커스텀 MCP 서버에 통합하는 경우 아래 영향이 있습니다.
  - `registerTools`(`@seed-design/mcp`)와 `initializeTools`, `server`(`@seed-design/docs-mcp`)가 다루는 `McpServer`의 출처가 `@modelcontextprotocol/sdk`에서 `@modelcontextprotocol/server`로 변경됩니다. v1으로 만든 `McpServer`는 더 이상 넘길 수 없으므로, 함께 v2로 옮겨야 합니다.
  - `@modelcontextprotocol/server`를 직접 설치해야 합니다. 마이그레이션은 [공식 가이드](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/upgrade-to-v2.md)의 codemod로 대부분 자동 처리됩니다.

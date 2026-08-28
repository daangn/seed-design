---
"@seed-design/docs-mcp": minor
---

`SEED_DOCS_BASE_URL` 환경 변수로 읽어올 문서 사이트를 바꿀 수 있습니다.

CLI에는 `--baseUrl`이 있어 로컬 문서 서버나 아카이브 사이트를 조회할 수 있었는데, MCP 서버에는 대응하는 수단이 없어 항상 프로덕션만 바라봤습니다. 이제 MCP 클라이언트 설정에서 `env`로 넘기면 됩니다. 값이 없으면 지금까지와 같이 `https://seed-design.io`를 씁니다.

```json
{
  "mcpServers": {
    "seed-docs": {
      "command": "seed-docs-mcp",
      "env": { "SEED_DOCS_BASE_URL": "http://localhost:3000" }
    }
  }
}
```

아이콘 도구가 안내하는 문서 주소도 같은 값을 따릅니다. 이전에는 도메인을 따로 들고 있어서, 다른 사이트를 조회하는 중에도 아이콘 링크만 프로덕션을 가리켰습니다.

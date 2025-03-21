# @seed-design/mcp

SEED Design의 MCP 서버를 제공합니다.

## 설치

Using npm:

```bash
npm install -g @seed-design/mcp
```

Using bun:

```bash
bun install -g @seed-design/mcp
```

## Cursor MCP 설정

```{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@seed-design/mcp"],
      "env": {
        "FIGMA_API_KEY": "your-figma-api-key"
      }
    }
  }
}
```

# @seed-design/docs-mcp

Official MCP server for SEED Design documentation.

This package is built for LLM-friendly docs access:

- `llms.txt` / `/llms/.../*.txt` first
- structured tool results (`outputSchema` + `structuredContent`)
- stdio and Streamable HTTP transports

## Installation

```bash
bun add @seed-design/docs-mcp
# or
npm install @seed-design/docs-mcp
```

## Running The Server

### stdio (local MCP clients)

```bash
# via npx
npx @seed-design/docs-mcp

# if globally installed
seed-docs-mcp
```

### Streamable HTTP

```bash
# starts HTTP server (default: http://127.0.0.1:3100/mcp)
npx -y --package @seed-design/docs-mcp seed-docs-mcp-http
```

Environment variables:

- `PORT` (default: `3100`)
- `SEED_DOCS_MCP_HOST` (default: `127.0.0.1`)
- `SEED_DOCS_MCP_PATH` (default: `/mcp`)

## Client Configuration

### Claude Desktop (stdio)

```json
{
  "mcpServers": {
    "seed-docs": {
      "command": "npx",
      "args": ["-y", "@seed-design/docs-mcp"]
    }
  }
}
```

### Claude Code (HTTP)

```bash
claude mcp add --transport http seed-docs http://127.0.0.1:3100/mcp
```

## Tool Set (V2)

### Documentation

- `list_sections`: list section metadata and categories
- `list_docs`: list docs in a section
- `search_docs`: search docs by title/path
- `read_doc`: read one doc (`llms.txt` text only)
- `read_docs_batch`: read multiple docs in one call (`llms.txt` text only)

### Rootage

- `read_rootage`: read rootage JSON index/resource

### Icons

- `list_icons`: list icons with filters
- `search_icons`: search icons by keyword
- `read_icon`: read icon details and usage imports

## Resources

- `seed-docs://sections`
- `seed-docs://{section}/index`
- `seed-rootage://index`
- `seed-icons://services`

## Prompts

- `seed_docs_lookup`

## Docs Format Policy

`read_doc` and `read_docs_batch` only fetch `llms.txt`-style text documents:

- allowed: `.../llms.txt`, `/llms/.../*.txt`
- rejected: `text/html` responses (no HTML fallback)

This is intentional to optimize model consumption and avoid noisy HTML parsing.

## Breaking Changes (V2)

Removed tools:

- `discover_seed_docs`
- `get_doc`
- `get_full_docs`
- `get_rootage`
- `get_icon_details`

Migration map:

- `discover_seed_docs` -> `list_sections`
- `get_doc` -> `read_doc`
- `get_full_docs` -> `read_docs_batch`
- `get_rootage` -> `read_rootage`
- `get_icon_details` -> `read_icon`

## Programmatic Usage

```ts
import { server, initializeTools, startHttpServer } from "@seed-design/docs-mcp";

await initializeTools(server);

// stdio transport: use your own StdioServerTransport
// streamable HTTP transport:
await startHttpServer({
  host: "127.0.0.1",
  port: 3100,
  path: "/mcp",
});
```

## Development

```bash
bun install
bun --filter @seed-design/docs-mcp typecheck
bun --filter @seed-design/docs-mcp build
```

### Test with MCP Inspector

```bash
# stdio
npx @modelcontextprotocol/inspector bun ./dist/stdio.js

# streamable HTTP
npx @modelcontextprotocol/inspector
# connect to http://127.0.0.1:3100/mcp
```

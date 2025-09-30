# @seed-design/docs-mcp

MCP (Model Context Protocol) server for accessing SEED Design documentation. This server provides LLMs with structured access to SEED Design's React and Figma component documentation, changelogs, and more.

## Installation

```bash
npm install -g @seed-design/docs-mcp
# or
bun add -g @seed-design/docs-mcp
```

## Usage

### As a standalone MCP server

```bash
# Start the server
@seed-design/docs-mcp

# With verbose logging
@seed-design/docs-mcp --verbose

# With custom cache TTL (in milliseconds)
@seed-design/docs-mcp --cache-ttl 1800000
```

### Integration with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "seed-docs": {
      "command": "npx",
      "args": ["@seed-design/docs-mcp"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "seed-docs": {
      "command": "@seed-design/docs-mcp"
    }
  }
}
```

In Development

```json
{
  "mcpServers": {
    "seed-docs": {
      "command": "bun",
      "args": ["run", "/Users/june.jung/Documents/GitHub/Daangn/seed-design/packages/docs-mcp/bin/stdio.js"],
      "cwd": "/Users/june.jung/Documents/GitHub/Daangn/seed-design/packages/docs-mcp",
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev

# Build the package
bun run build

# Clean build artifacts
bun run clean
```

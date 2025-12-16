# @seed-design/docs-mcp

MCP (Model Context Protocol) tools for accessing SEED Design documentation. This package provides LLMs with structured access to SEED Design's React and Breeze component documentation, changelogs, and more.

## Installation

```bash
npm install @seed-design/docs-mcp
# or
bun add @seed-design/docs-mcp
```

## Usage

### As a stdio MCP server (CLI)

For use with Claude Desktop or other MCP clients:

```bash
# Global installation
npm install -g @seed-design/docs-mcp
seed-docs-mcp

# Or via npx
npx @seed-design/docs-mcp
```

### Integration with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

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

Or if installed globally:

```json
{
  "mcpServers": {
    "seed-docs": {
      "command": "seed-docs-mcp"
    }
  }
}
```

### Programmatic Usage

For building custom MCP servers or integrating into your own applications:

```javascript
import { server } from "@seed-design/docs-mcp/server";
import { initializeTools } from "@seed-design/docs-mcp/tools";

// Initialize the tools
await initializeTools(server);

// Use with your preferred transport
// Example: stdio, HTTP, SSE, etc.
```

## Available Tools

### React Components

- `list_react_components` - List all available SEED React components
- `get_react_component` - Get detailed documentation for a specific React component
- `get_react_changelog` - Get changelog for SEED React package

### Breeze Utilities

- `list_breeze_components` - List all available SEED Breeze utility components
- `get_breeze_component` - Get detailed documentation for a specific Breeze component

### Design Guidelines

- `list_docs_components` - List all available SEED Design component guidelines
- `get_docs_component` - Get design guidelines for a specific component (anatomy, properties, usage)

### Search

- `search_seed_docs` - Search across all SEED Design documentation (supports filtering by: design, react, breeze, lynx)

## Development

```bash
# Install dependencies
bun install

# Run in development mode (stdio)
bun run dev

# Build the package
bun run build

# Clean build artifacts
bun run clean
```

### Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector bun ./dist/stdio.js
```

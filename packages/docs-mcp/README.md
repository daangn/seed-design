# @seed-design/docs-mcp

MCP (Model Context Protocol) tools for accessing SEED Design documentation. This package provides LLMs with structured access to SEED Design's React and Breeze component documentation, design guidelines, Rootage specifications, and more.

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

### Configuration

| Environment variable | Default                  | Description                                                                                                                |
| -------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `SEED_DOCS_BASE_URL` | `https://seed-design.io` | Docs site the server reads. Point it at a local docs server, or at an archived site such as `https://v1-2.seed-design.io`. |

MCP clients pass environment variables through their server config:

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

### Discovery

- `discover_seed_docs` - Discover all available documentation sections and categories. Call this first to understand the documentation structure.

### Documentation

- `list_docs` - List available documents in a section, with optional category filter. Sections are read from the live site, so call `discover_seed_docs` for the current list rather than hardcoding one
- `get_doc` - Get the content of a specific document by section and path
- `get_full_docs` - Get all documents from a section combined into a single text

### Rootage (Design Tokens & Component Specs)

- `get_rootage` - Get SEED Design rootage specifications (design tokens and component specs)
  - Without path: Returns index with all available resources
  - With path: Returns specific resource (e.g., `/color.json`, `/components/action-button.json`)

### Icons

- `list_icons` - List all available icons with optional type filter
- `search_icons` - Search icons by keyword
- `get_icon_details` - Get detailed information about a specific icon

## Documentation Sections

| Section          | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| `react`          | React component library, API references, usage examples              |
| `docs`           | Component design guidelines, Foundation (color, typography, spacing) |
| `breeze`         | Ready-to-use utility UI components                                   |
| `ai-integration` | MCP, llms.txt integration guides                                     |
| `lynx`           | Lynx framework                                                       |

## Example Usage

```text
// 1. Discover available sections
discover_seed_docs()

// 2. List React components
list_docs({ section: "react", category: "components" })

// 3. Get the React API for a component
get_doc({ section: "react", path: "components/action-button" })

// 4. Get its design spec (anatomy, properties, guidelines)
get_doc({ section: "components", path: "action-button" })

// 5. Get a foundation document
get_doc({ section: "foundations", path: "color" })

// 6. Get AI integration guide
get_doc({ section: "ai-integration", path: "figma-mcp" })
```

## Development

```bash
# Install dependencies
bun install

# Run in development mode (stdio)
bun run dev

# Build the package
bun run build

# Lint check
bun run lint

# Lint fix
bun run lint:fix

# Type check
bun run typecheck

# Clean build artifacts
bun run clean
```

### Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector bun ./dist/stdio.js
```

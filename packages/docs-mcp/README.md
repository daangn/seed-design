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
initializeTools(server);

// Use with your preferred transport
// Example: stdio, HTTP, SSE, etc.
```

## Available Tools

### Search

- `search_docs` - Search the full text of the documentation and get back the matching documents, ranked, one per line: the address, then the document's title and description. Use this when you do not know which section holds the answer. An address is the document's site path, so dropping its leading slash and splitting at the next one gives the `section` and `path` that `get_doc` takes

### Documentation

- `list_docs` - List available documents in a section. Sections are read from the live site rather than hardcoded, and an unknown section is rejected with the current list
- `get_doc` - Get the content of a specific document by section and path

### Rootage (Design Tokens & Component Specs)

- `get_rootage` - Get SEED Design rootage specifications (design tokens and component specs)
  - Without path: Returns index with all available resources
  - With path: Returns specific resource (e.g., `/color.json`, `/components/action-button.json`)

## Documentation Sections

Sections are read from the live site at call time, so this README does not list them — a
list here would be one more copy to drift. A `search_docs` address names its section as its
first segment, and `list_docs` answers an unknown section with the current set.

## Example Usage

```text
// 0. Search when you do not know where the answer lives
search_docs({ query: "액션 버튼" })
// → /components/action-button#hierarchy  Action Button — <description>
//   get_doc({ section: "components", path: "action-button#hierarchy" })

// 1. List React documents
list_docs({ section: "react" })

// 2. Get the React API for a component
get_doc({ section: "react", path: "components/action-button" })

// 3. Get its design spec (anatomy, properties, guidelines)
get_doc({ section: "components", path: "action-button" })

// 4. Get a foundation document
get_doc({ section: "foundations", path: "color" })

// 5. Get AI integration guide
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

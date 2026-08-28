#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { server } from "./server.js";
import { initializeTools } from "./tools/index.js";

async function main() {
  const transport = new StdioServerTransport();
  initializeTools(server);
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});

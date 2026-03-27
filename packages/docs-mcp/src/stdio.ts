#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { parseCliOptions } from "./cli-utils.js";
import { server } from "./server.js";
import { initializeTools } from "./tools/index.js";

async function main() {
  const options = parseCliOptions(process.argv.slice(2));
  const transport = new StdioServerTransport();
  await initializeTools(server, options);
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});

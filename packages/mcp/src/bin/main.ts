#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { logger } from "../logger";
import { createFigmaWebSocketClient } from "../websocket";
import { registerTools } from "../tools";
import { registerPrompts } from "../prompts";

// Add command line argument parsing
const args = process.argv.slice(2);
const serverArg = args.find((arg) => arg.startsWith("--server="));
const serverUrl = serverArg ? serverArg.split("=")[1] : "localhost";

// Create Figma WebSocket client
const figmaClient = createFigmaWebSocketClient(serverUrl);

// Create MCP server
const server = new McpServer({
  name: "SEED Design MCP",
  version: "1.0.0",
});

// Register tools and prompts
registerTools(server, figmaClient);
registerPrompts(server);

// Start the server
async function main() {
  try {
    // Try to connect to Figma socket server
    figmaClient.connectToFigma();
  } catch (error) {
    logger.warn(
      `Could not connect to Figma initially: ${error instanceof Error ? error.message : String(error)}`,
    );
    logger.warn("Will try to connect when the first command is sent");
  }

  // Start the MCP server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("FigmaMCP server running on stdio");
}

// Run the server
main().catch((error) => {
  logger.error(
    `Error starting FigmaMCP server: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});

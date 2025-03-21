import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { FigmaMcpServer } from "./server";
import { getServerConfig } from "./config";
import { ConsoleLogger } from "./logger";

/**
 * Determines if the server should run in stdio mode
 */
function isRunningInStdioMode(): boolean {
  return process.env["NODE_ENV"] === "cli" || process.argv.includes("--stdio");
}

/**
 * Starts the Figma MCP server
 */
export async function startServer(): Promise<void> {
  // Determine server mode (stdio or HTTP)
  const stdioMode = isRunningInStdioMode();

  // Get configuration
  const config = getServerConfig(stdioMode);

  // Create server instance
  const server = new FigmaMcpServer(config.figmaApiKey);

  // Start in appropriate mode
  if (stdioMode) {
    // Connect to stdio transport for CLI mode
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } else {
    // Start HTTP server for web mode
    ConsoleLogger.log(`Initializing Figma MCP Server in HTTP mode on port ${config.port}...`);
    await server.startHttpServer(config.port);
  }
}

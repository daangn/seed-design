import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import pkg from "../package.json" with { type: "json" };

export function createServer(): McpServer {
  return new McpServer(
    {
      name: "seed-design-docs",
      version: pkg.version,
    },
    {
      debouncedNotificationMethods: [
        "notifications/tools/list_changed",
        "notifications/resources/list_changed",
        "notifications/prompts/list_changed",
      ],
    },
  );
}

export const server = createServer();

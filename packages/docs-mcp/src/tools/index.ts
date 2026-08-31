import type { McpServer } from "@modelcontextprotocol/server";
import { registerDiscoverSeedDocsTool } from "./discover.js";
import { registerListDocsTool, registerGetDocTool } from "./docs.js";
import { registerGetRootageTool } from "./get-rootage.js";

export const initializeTools = (server: McpServer) => {
  registerDiscoverSeedDocsTool(server);
  registerListDocsTool(server);
  registerGetDocTool(server);
  registerGetRootageTool(server);
};

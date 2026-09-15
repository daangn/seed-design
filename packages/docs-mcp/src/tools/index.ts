import type { McpServer } from "@modelcontextprotocol/server";
import { registerListDocsTool, registerGetDocTool } from "./docs.js";
import { registerGetRootageTool } from "./get-rootage.js";
import { registerSearchDocsTool } from "./search.js";

export const initializeTools = (server: McpServer) => {
  registerListDocsTool(server);
  registerSearchDocsTool(server);
  registerGetDocTool(server);
  registerGetRootageTool(server);
};

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerDiscoverSeedDocsTool } from "./discover.js";
import { registerListDocsTool, registerGetDocTool, registerGetFullDocsTool } from "./docs.js";
import { registerGetRootageTool } from "./get-rootage.js";
import { registerGuidelineTools } from "./guidelines.js";
import { registerIconTools } from "./icon-tools.js";

export const initializeTools = async (server: McpServer) => {
  registerDiscoverSeedDocsTool(server);
  registerListDocsTool(server);
  registerGetDocTool(server);
  registerGetFullDocsTool(server);
  registerGetRootageTool(server);
  registerGuidelineTools(server);
  await registerIconTools(server);
};

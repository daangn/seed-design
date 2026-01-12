import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Tool } from "../types.js";
import { discoverSeedDocsTool } from "./discover.js";
import { listDocsTool, getDocTool, getFullDocsTool } from "./docs.js";
import { getRootageTool } from "./get-rootage.js";
import { listIconsTool, searchIconsTool, getIconDetailsTool } from "./icon-tools.js";

const tools: Tool[] = [
  discoverSeedDocsTool,
  listDocsTool,
  getDocTool,
  getFullDocsTool,
  getRootageTool,
  listIconsTool,
  searchIconsTool,
  getIconDetailsTool,
];

const registeredToolCache = new Map<string, Tool>();

export const initializeTools = async (server: McpServer) => {
  await Promise.all(
    tools.map(async (tool) => {
      if (registeredToolCache.has(tool.name)) {
        return;
      }
      registeredToolCache.set(tool.name, tool);
      const toolCtx = await tool.ctx?.();
      tool.exec(server, {
        name: tool.name,
        description: tool.description,
        ctx: toolCtx,
      });
    }),
  );
};

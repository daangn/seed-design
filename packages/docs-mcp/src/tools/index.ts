import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Tool } from "../types.js";
import { listReactComponentsTool, listBreezeComponentsTool } from "./list-components.js";
import { getReactComponentTool, getBreezeComponentTool } from "./get-component.js";
import { getReactChangelogTool } from "./get-changelog.js";

const tools: Tool[] = [
  // React component tools
  listReactComponentsTool,
  getReactComponentTool,
  getReactChangelogTool,

  // Breeze component tools
  listBreezeComponentsTool,
  getBreezeComponentTool,
];

const registeredToolCache = new Map<string, Tool>();

export const initializeTools = async (server: McpServer) => {
  await Promise.all(
    tools.map(async (tool) => {
      const toolCtx = await tool.ctx?.();
      if (registeredToolCache.has(tool.name)) {
        return;
      }
      registeredToolCache.set(tool.name, tool);
      tool.exec(server, {
        name: tool.name,
        description: tool.description,
        ctx: toolCtx,
      });
    }),
  );
};

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Tool } from "../types.js";
import {
  listReactComponentsTool,
  listBreezeComponentsTool,
  listDocsComponentsTool,
  listFoundationTool,
} from "./list-components.js";
import {
  getReactComponentTool,
  getBreezeComponentTool,
  getDocsComponentTool,
  getFoundationTool,
} from "./get-component.js";
import { getReactChangelogTool } from "./get-changelog.js";
import { getRootageTool } from "./get-rootage.js";

const tools: Tool[] = [
  // React component tools
  listReactComponentsTool,
  getReactComponentTool,
  getReactChangelogTool,

  // Breeze component tools
  listBreezeComponentsTool,
  getBreezeComponentTool,

  // Docs component tools (Design Guidelines)
  listDocsComponentsTool,
  getDocsComponentTool,

  // Foundation tools
  listFoundationTool,
  getFoundationTool,

  // Rootage tools
  getRootageTool,
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

import { fetchReactComponentList, fetchBreezeComponentList } from "../fetch.js";
import type { Tool, ComponentInfo } from "../types.js";

export const listReactComponentsTool: Tool<{ componentList: ComponentInfo[] }> = {
  name: "list_react_components",
  description:
    "List all available React components in SEED Design. This tool retrieves the names of all available SEED React components.",
  async ctx() {
    try {
      const componentList = await fetchReactComponentList();
      return { componentList };
    } catch (error) {
      throw new Error(
        `Failed to initialize list React components tool: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
  exec(server, { ctx, name, description }) {
    server.tool(name, description, {}, async () => {
      const components = ctx.componentList;
      const formatted = components.map((c: ComponentInfo) => `- ${c.title} (${c.name})`).join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Found ${components.length} React components:\n\n${formatted}`,
          },
        ],
      };
    });
  },
};

export const listBreezeComponentsTool: Tool<{ componentList: any[] }> = {
  name: "list_breeze_components",
  description:
    "List all available Breeze utility components in SEED Design. This tool retrieves the names of all available SEED Breeze components.",
  async ctx() {
    try {
      const componentList = await fetchBreezeComponentList();
      return { componentList };
    } catch (error) {
      throw new Error(
        `Failed to initialize list Breeze components tool: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
  exec(server, { ctx, name, description }) {
    server.tool(name, description, {}, async () => {
      const components = ctx.componentList;
      const formatted = components.map((c: any) => `- ${c.title} (${c.name})`).join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Found ${components.length} Breeze components:\n\n${formatted}`,
          },
        ],
      };
    });
  },
};

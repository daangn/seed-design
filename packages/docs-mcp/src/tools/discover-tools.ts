import { z } from "zod";
import type { Tool } from "../types.js";
import { getToolCatalog, getToolsByCategory, matchesQuery } from "../tool-catalog.js";

/**
 * Tool Discovery Tool
 *
 * Helps agents discover available tools in this MCP server and understand
 * when to use each tool. This implements the "Tool Search Tool" pattern.
 */
export const discoverToolsTool: Tool = {
  name: "discover_tools",
  description:
    "Discover available tools in this MCP server and learn when to use each tool. " +
    "Call this first to understand what documentation tools are available and choose the right one for your task.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        query: z
          .string()
          .optional()
          .describe(
            "Optional search query to filter tools (e.g., 'installation', 'stackflow', 'component'). " +
              "If omitted, returns all available tools grouped by category.",
          ),
        category: z
          .enum(["discovery", "react", "breeze", "design-guidelines", "rootage"])
          .optional()
          .describe("Optional category filter to show only tools from a specific category."),
      },
      async ({ query, category }) => {
        let tools = getToolCatalog();

        // Filter by category if provided
        if (category) {
          tools = getToolsByCategory(category);
        }

        // Filter by query if provided
        if (query) {
          tools = tools.filter((t) => matchesQuery(t, query));
        }

        // Group tools by category for better readability
        const groupedTools: Record<string, typeof tools> = {};
        for (const tool of tools) {
          if (!groupedTools[tool.category]) {
            groupedTools[tool.category] = [];
          }
          groupedTools[tool.category].push(tool);
        }

        // Format response
        const response = {
          query: query || null,
          category: category || null,
          totalTools: getToolCatalog().length,
          matchedTools: tools.length,
          toolsByCategory: Object.entries(groupedTools).map(([cat, catTools]) => ({
            category: cat,
            tools: catTools.map((t) => ({
              name: t.name,
              description: t.description,
              whenToUse: t.whenToUse,
              exampleArgs: t.exampleArgs,
            })),
          })),
          tip:
            query || category
              ? "Use discover_tools without parameters to see all available tools."
              : "Use a query parameter to search for specific tools (e.g., 'installation', 'component').",
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      },
    );
  },
};

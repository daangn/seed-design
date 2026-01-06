import { z } from "zod";
import type { Tool } from "../types.js";
import { fetchRootageIndex, fetchRootageResource } from "../fetch.js";

export const getRootageTool: Tool = {
  name: "get_rootage",
  description:
    "Get SEED Design rootage specification. Use without path to get index (available resources list). " +
    "Use with path to get specific resource (e.g., '/color.json', '/components/action-button.json').",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        path: z
          .string()
          .optional()
          .describe(
            "Resource path from index.json (e.g., '/color.json', '/components/action-button.json'). " +
              "Omit to get index with all available paths.",
          ),
      },
      async ({ path }) => {
        try {
          if (!path) {
            // Return index.json
            const index = await fetchRootageIndex();
            return {
              content: [{ type: "text", text: JSON.stringify(index, null, 2) }],
            };
          }

          // Return specific resource
          const resource = await fetchRootageResource(path);
          return {
            content: [{ type: "text", text: JSON.stringify(resource, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching rootage${path ? ` resource '${path}'` : " index"}: ${
                  error instanceof Error ? error.message : "Unknown error"
                }\n\nUse get_rootage without path to see available resources.`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

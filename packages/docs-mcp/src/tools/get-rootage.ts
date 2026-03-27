import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchRootageIndex, fetchRootageResource } from "../fetch.js";
import { readOnlyAnnotations, toErrorMessage, toErrorResult } from "./utils.js";

export function registerRootageTools(server: McpServer): void {
  server.registerTool(
    "read_rootage",
    {
      title: "Read Rootage Data",
      description:
        "Read SEED rootage JSON data. If path is omitted, returns the rootage index JSON.",
      inputSchema: {
        path: z
          .string()
          .trim()
          .min(1)
          .optional()
          .describe("Rootage resource path (e.g. /color.json, /components/action-button.json)."),
      },
      outputSchema: {
        path: z.string().nullable(),
        data: z.unknown(),
        isIndex: z.boolean(),
        error: z.string().optional(),
      },
      annotations: readOnlyAnnotations,
    },
    async ({ path }) => {
      try {
        if (path === undefined) {
          const index = await fetchRootageIndex();
          return {
            content: [{ type: "text", text: JSON.stringify(index, null, 2) }],
            structuredContent: {
              path: null,
              data: index,
              isIndex: true,
            },
          };
        }

        const resource = await fetchRootageResource(path);
        return {
          content: [{ type: "text", text: JSON.stringify(resource, null, 2) }],
          structuredContent: {
            path,
            data: resource,
            isIndex: false,
          },
        };
      } catch (error) {
        return toErrorResult(
          `Failed to read rootage${path ? ` path '${path}'` : " index"}: ${toErrorMessage(error)}`,
          { path: path ?? null, data: null, isIndex: !path },
        );
      }
    },
  );
}

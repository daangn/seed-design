import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchRootageIndex, fetchRootageResource } from "../fetch.js";

const readOnlyAnnotations = {
  readOnlyHint: true,
  idempotentHint: true,
} as const;

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
        if (!path) {
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
        const message = `Failed to read rootage${path ? ` path '${path}'` : " index"}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
        return {
          content: [{ type: "text", text: message }],
          structuredContent: {
            path: path ?? null,
            data: null,
            isIndex: !path,
            error: message,
          },
          isError: true,
        };
      }
    },
  );
}

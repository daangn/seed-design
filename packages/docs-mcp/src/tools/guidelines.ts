import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * GuidelineSpec MCP tools.
 *
 * Phase A: skeletons only. Tool names, descriptions and input schemas are final,
 * but the handlers do not yet read compiled guideline JSON — the data source is
 * wired in Phase B. Each handler returns a structured "not_implemented" payload so
 * the tool is callable and self-describing in the meantime.
 */

const guidelineScopeSchema = z
  .enum(["component", "foundation", "pattern"])
  .describe("Guideline scope: component, foundation, or pattern.");

const PHASE_B_NOTICE =
  "This tool is registered but not yet wired to guideline data (planned for Phase B).";

function notImplemented(tool: string, params: Record<string, unknown>) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          { status: "not_implemented", tool, notice: PHASE_B_NOTICE, params },
          null,
          2,
        ),
      },
    ],
  };
}

export function registerListGuidelinesTool(server: McpServer): void {
  server.registerTool(
    "list_guidelines",
    {
      description:
        "List SEED Design guidelines, optionally filtered by scope and/or target. " +
        "Use scope to narrow to component/foundation/pattern, and target to a specific spec (e.g. 'action-button').",
      inputSchema: z.object({
        scope: guidelineScopeSchema.optional(),
        target: z
          .string()
          .optional()
          .describe("Target spec name (file name without extension, e.g. 'action-button')."),
      }),
    },
    async ({ scope, target }) => notImplemented("list_guidelines", { scope, target }),
  );
}

export function registerGetGuidelineTool(server: McpServer): void {
  server.registerTool(
    "get_guideline",
    {
      description:
        "Get a single guideline by its generated id (e.g. 'G-C-action-button-001'), " +
        "including its deprecated status and replacement reason when applicable.",
      inputSchema: z.object({
        id: z.string().describe("Guideline id, e.g. 'G-C-action-button-001'."),
      }),
    },
    async ({ id }) => notImplemented("get_guideline", { id }),
  );
}

export function registerSearchGuidelinesTool(server: McpServer): void {
  server.registerTool(
    "search_guidelines",
    {
      description:
        "Search guidelines across all specs by keyword. Optionally constrain the search to a single scope.",
      inputSchema: z.object({
        query: z.string().describe("Keyword(s) to search for in guideline statements."),
        scope: guidelineScopeSchema.optional(),
      }),
    },
    async ({ query, scope }) => notImplemented("search_guidelines", { query, scope }),
  );
}

export function registerGetDetectableRulesTool(server: McpServer): void {
  server.registerTool(
    "get_detectable_rules",
    {
      description:
        "Return only guidelines flagged as statically detectable (detectable: true), " +
        "intended for doctor-style automated checks. Optionally filter by scope and/or target.",
      inputSchema: z.object({
        scope: guidelineScopeSchema.optional(),
        target: z
          .string()
          .optional()
          .describe("Target spec name (file name without extension, e.g. 'action-button')."),
      }),
    },
    async ({ scope, target }) => notImplemented("get_detectable_rules", { scope, target }),
  );
}

/**
 * Register all guideline tools on the given server.
 */
export function registerGuidelineTools(server: McpServer): void {
  registerListGuidelinesTool(server);
  registerGetGuidelineTool(server);
  registerSearchGuidelinesTool(server);
  registerGetDetectableRulesTool(server);
}

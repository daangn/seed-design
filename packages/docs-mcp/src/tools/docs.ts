import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { fetchDocsList, fetchDoc, requireSection } from "../fetch.js";

/**
 * Sections come from the published index, so they cannot be an enum baked into the
 * schema — that is what left this server advertising categories the site had already
 * removed. Unknown values are rejected at call time with the live list attached, which
 * lets a caller working from a stale prompt correct itself in one retry.
 */
const sectionArg = z
  .string()
  .describe("Documentation section id. Call discover_seed_docs for the current list.");

function errorResult(error: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: error instanceof Error ? error.message : `Unknown error: ${String(error)}`,
      },
    ],
    isError: true,
  };
}

export function registerListDocsTool(server: McpServer): void {
  server.registerTool(
    "list_docs",
    {
      description:
        "List available documents in a SEED Design documentation section. " +
        "Use discover_seed_docs first to see all available sections.",
      inputSchema: z.object({ section: sectionArg }),
    },
    async ({ section }) => {
      try {
        const resolved = await requireSection(section);
        const docs = await fetchDocsList(section);

        // Sorted by the path `get_doc` takes, so documents sharing a prefix sit together and
        // the listing shows the section's shape without the index declaring one.
        const formatted = [...docs]
          .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))
          .map((doc) => {
            const deprecated = doc.deprecated ? " (deprecated)" : "";
            const description = doc.description ? ` — ${doc.description}` : "";
            return `- ${doc.title}${deprecated} (path: ${doc.path})${description}`;
          })
          .join("\n");

        return {
          content: [
            {
              type: "text" as const,
              text: `# ${resolved.label} Documentation\n\nTotal: ${docs.length} documents\n\n${formatted}\n\n## Usage\n\nUse get_doc with section="${section}" and a path above to read a document.`,
            },
          ],
        };
      } catch (error) {
        return errorResult(error);
      }
    },
  );
}

export function registerGetDocTool(server: McpServer): void {
  server.registerTool(
    "get_doc",
    {
      description:
        "Get the content of a specific SEED Design document. " +
        "Use list_docs first to see available documents and their paths.",
      inputSchema: z.object({
        section: sectionArg,
        path: z
          .string()
          .describe(
            "Document path relative to the section, e.g. 'components/action-button', 'color'",
          ),
      }),
    },
    async ({ section, path }) => {
      try {
        return { content: [{ type: "text" as const, text: await fetchDoc(section, path) }] };
      } catch (error) {
        return errorResult(error);
      }
    },
  );
}

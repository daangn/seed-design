import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { fetchDocsList, fetchDoc, fetchSectionFull, requireSection } from "../fetch.js";

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
        "Use discover_seed_docs first to see all available sections and categories.",
      inputSchema: z.object({
        section: sectionArg,
        category: z
          .string()
          .optional()
          .describe("Optional category filter within the section, e.g. 'components'"),
      }),
    },
    async ({ section, category }) => {
      try {
        const resolved = await requireSection(section);
        const docs = await fetchDocsList(section, category);

        const grouped = new Map<string, typeof docs>();
        for (const doc of docs) {
          const existing = grouped.get(doc.category);
          if (existing) {
            existing.push(doc);
          } else {
            grouped.set(doc.category, [doc]);
          }
        }

        const formatted = [...grouped.entries()]
          .map(([categoryId, categoryDocs]) => {
            const lines = categoryDocs.map((doc) => {
              const deprecated = doc.deprecated ? " (deprecated)" : "";
              const description = doc.description ? ` — ${doc.description}` : "";
              return `  - ${doc.title}${deprecated} (path: ${doc.path})${description}`;
            });
            return `### ${categoryId}\n\n${lines.join("\n")}`;
          })
          .join("\n\n");

        const filter = category ? ` (filtered by: ${category})` : "";

        return {
          content: [
            {
              type: "text" as const,
              text: `# ${resolved.label} Documentation\n\nTotal: ${docs.length} documents${filter}\n\n${formatted}\n\n## Usage\n\nUse get_doc with section="${section}" and a path above to read a document.`,
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

export function registerGetFullDocsTool(server: McpServer): void {
  server.registerTool(
    "get_full_docs",
    {
      description:
        "Get all documents from a section combined into a single text. " +
        "Only some sections publish one — discover_seed_docs reports which.",
      inputSchema: z.object({ section: sectionArg }),
    },
    async ({ section }) => {
      try {
        return { content: [{ type: "text" as const, text: await fetchSectionFull(section) }] };
      } catch (error) {
        return errorResult(error);
      }
    },
  );
}

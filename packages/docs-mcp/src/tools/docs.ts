import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
import { docLine } from "../docs-index.js";
import { fetchDocsList, fetchDoc, requireSection } from "../fetch.js";

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
        "List SEED Design documents, one per line: the address first, then the document's title " +
        "and description. Pass an address to get_doc as it stands. Without `section` this lists " +
        "every document on the site, a few hundred lines; name a section to list only its " +
        "documents, or use search_docs when you know what you are looking for.",
      inputSchema: z.object({
        /**
         * Sections come from the published index, so they cannot be an enum baked into the
         * schema — that is what left this server advertising categories the site had already
         * removed. Unknown values are rejected at call time with the live list attached, which
         * lets a caller working from a stale prompt correct itself in one retry.
         */
        section: z
          .string()
          .optional()
          .describe(
            "Section id alone, without slashes, such as `react` or `foundations`: the first " +
              "segment of an address. An unknown id is rejected with the current list.",
          ),
      }),
    },
    async ({ section }) => {
      try {
        const heading =
          section === undefined ? "SEED Design" : (await requireSection(section)).label;
        const docs = await fetchDocsList(section);

        // Sorted by address, so documents sharing a prefix sit together and the listing shows
        // the site's shape without the index declaring one.
        const formatted = [...docs]
          .sort((a, b) => (a.docUrl < b.docUrl ? -1 : a.docUrl > b.docUrl ? 1 : 0))
          .map((doc) => `- ${docLine(doc.docUrl, doc)}`)
          .join("\n");

        return {
          content: [
            {
              type: "text" as const,
              text: `# ${heading} Documentation\n\nTotal: ${docs.length} documents\n\n${formatted}\n\n## Usage\n\nPass an address above to get_doc as it stands.`,
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
        "Get the full markdown of one SEED Design document by its address, " +
        "as search_docs or list_docs prints it.",
      inputSchema: z.object({
        path: z
          .string()
          .describe(
            "The document's address, starting with a slash: `/react/components/action-button`, " +
              "`/foundations/color`, or `/react` for a section's own page. A trailing `#anchor` " +
              "is ignored and the whole document comes back. Any other form, such as a path " +
              "without its leading slash or a bare name like `action-button`, finds nothing.",
          ),
      }),
    },
    async ({ path }) => {
      try {
        return { content: [{ type: "text" as const, text: await fetchDoc(path) }] };
      } catch (error) {
        return errorResult(error);
      }
    },
  );
}

import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { searchDocs } from "../search.js";

/**
 * The only tool here that answers a question phrased in the caller's words rather than in the
 * site's structure. `discover_seed_docs` and `list_docs` need the section already; this needs
 * nothing but the words, which is what a caller has before it knows what to look for.
 */
export function registerSearchDocsTool(server: McpServer): void {
  server.registerTool(
    "search_docs",
    {
      description:
        "Search the full text of SEED Design documentation and get back document addresses. " +
        "Use this when you do not already know which section or document holds the answer. " +
        "Each address is a section id followed by the path within it, so " +
        '`react/components/action-button` means section="react", path="components/action-button" ' +
        "for get_doc. An address may carry a `#anchor` naming the heading that matched; drop it " +
        "before calling get_doc, which reads the whole document. " +
        "Queries are matched word by word without morpheme analysis, so `액션 버튼` finds what " +
        "`액션버튼` does not.",
      inputSchema: z.object({
        query: z
          .string()
          .min(1)
          .describe(
            "Words to search for. Korean and English both work; separate words with spaces.",
          ),
      }),
    },
    async ({ query }) => {
      try {
        const { addresses, total } = await searchDocs(query);

        if (addresses.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `No documents matched "${query}". Try fewer or differently spaced words, or call discover_seed_docs to browse by section.`,
              },
            ],
          };
        }

        const shown =
          total > addresses.length
            ? `Showing the top ${addresses.length} of ${total} matches`
            : `${total} match${total === 1 ? "" : "es"}`;

        return {
          content: [
            {
              type: "text" as const,
              text: `# Search: ${query}\n\n${shown}\n\n${addresses.map((address) => `- ${address}`).join("\n")}\n\n## Usage\n\nSplit an address at its first slash: the part before it is \`section\`, the rest is \`path\` for get_doc.`,
            },
          ],
        };
      } catch (error) {
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
    },
  );
}

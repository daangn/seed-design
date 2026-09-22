import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { searchResultLine } from "../docs-index.js";
import { fetchDocsIndex } from "../fetch.js";
import { searchDocs } from "../search.js";

/**
 * The only tool here that answers a question phrased in the caller's words rather than in the
 * site's structure. `list_docs` and `get_doc` need the section already; this needs nothing but
 * the words, which is what a caller has before it knows what to look for.
 */
export function registerSearchDocsTool(server: McpServer): void {
  server.registerTool(
    "search_docs",
    {
      description:
        "Search the full text of SEED Design documentation and get back the matching documents, " +
        "one per line: the address first, then the document's title and description. " +
        "Use this when you do not already know which section or document holds the answer. " +
        "An address is the document's own path on the site, such as " +
        "`/react/components/action-button`; pass it to get_doc as it stands. An address may " +
        "carry a `#anchor` naming the heading that matched, which get_doc accepts and ignores, " +
        "returning the whole document. " +
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
        const [{ addresses, total }, index] = await Promise.all([
          searchDocs(query),
          fetchDocsIndex(),
        ]);

        if (addresses.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `No documents matched "${query}". Try fewer or differently spaced words.`,
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
              text: `# Search: ${query}\n\n${shown}\n\n${addresses.map((address) => `- ${searchResultLine(index, address)}`).join("\n")}\n\n## Usage\n\nEach line opens with an address. Pass it to get_doc as it stands, \`#anchor\` included.`,
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

import type { McpServer } from "@modelcontextprotocol/server";
import { fetchDocsIndex } from "../fetch.js";

export function registerDiscoverSeedDocsTool(server: McpServer): void {
  server.registerTool(
    "discover_seed_docs",
    {
      description:
        "Discover all available SEED Design documentation sections and categories. " +
        "Call this first to understand the documentation structure before using list_docs or get_doc.",
    },
    async () => {
      // Built from the published index rather than a compiled-in map, so this reflects
      // the live site even when this server has not been updated in a while.
      const index = await fetchDocsIndex();

      const sections = index.categories.map((category) => ({
        id: category.id,
        name: category.label,
        documentCount: category.sections.reduce((sum, s) => sum + s.items.length, 0),
        categories: category.sections.map((section) => ({
          id: section.id,
          name: section.label,
          documentCount: section.items.length,
        })),
        overviewUrl: category.llmsIndexUrl,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                totalSections: sections.length,
                sections,
                usage: {
                  listDocs:
                    "Use list_docs with section (and optional category) to get a document list",
                  getDoc: "Use get_doc with section and path to get document content",
                  examples: [
                    'get_doc({ section: "components", path: "action-button" })  // design spec',
                    'get_doc({ section: "react", path: "components/action-button" })  // React API',
                    'get_doc({ section: "foundations", path: "color" })',
                    'list_docs({ section: "react", category: "components" })',
                  ],
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}

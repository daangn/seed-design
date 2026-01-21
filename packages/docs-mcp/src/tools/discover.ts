import type { Tool } from "../types.js";
import { SECTIONS, SECTION_IDS } from "../config.js";

export const discoverSeedDocsTool: Tool = {
  name: "discover_seed_docs",
  description:
    "Discover all available SEED Design documentation sections and categories. " +
    "Call this first to understand the documentation structure before using list_docs or get_doc.",
  exec(server, { name, description }) {
    server.tool(name, description, {}, async () => {
      const sections = SECTION_IDS.map((id) => {
        const config = SECTIONS[id];
        const categories = Object.entries(config.categories);

        return {
          id,
          name: config.name,
          description: config.description,
          hasCategories: categories.length > 0,
          categories:
            categories.length > 0
              ? categories.map(([catId, catDesc]) => ({
                  id: catId,
                  description: catDesc,
                }))
              : undefined,
          endpoints: {
            overview: config.overviewPath,
            full: config.fullPath,
          },
        };
      });

      const response = {
        totalSections: sections.length,
        sections,
        usage: {
          listDocs: "Use list_docs with section (and optional category) to get document list",
          getDoc: "Use get_doc with section and path to get document content",
          examples: [
            'list_docs({ section: "react", category: "components" })',
            'get_doc({ section: "react", path: "components/button" })',
            'get_doc({ section: "ai-integration", path: "figma-mcp" })',
          ],
        },
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    });
  },
};

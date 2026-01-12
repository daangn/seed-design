import { z } from "zod";
import type { Tool } from "../types.js";
import { SECTIONS, SECTION_IDS, isValidSection, type SectionId } from "../config.js";
import { fetchDocsList, fetchDoc, fetchSectionFull } from "../fetch.js";

const sectionEnum = z.enum(SECTION_IDS as [SectionId, ...SectionId[]]);

export const listDocsTool: Tool = {
  name: "list_docs",
  description:
    "List available documents in a SEED Design documentation section. " +
    "Use discover_seed_docs first to see all available sections and categories.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        section: sectionEnum.describe(
          "Documentation section: react, docs, breeze, ai-integration, or lynx",
        ),
        category: z
          .string()
          .optional()
          .describe(
            "Optional category filter (e.g., 'components', 'foundation', 'getting-started')",
          ),
      },
      async ({ section, category }) => {
        if (!isValidSection(section)) {
          return {
            content: [
              {
                type: "text",
                text: `Invalid section: ${section}. Valid sections: ${SECTION_IDS.join(", ")}`,
              },
            ],
            isError: true,
          };
        }

        try {
          const docs = await fetchDocsList(section, category);
          const config = SECTIONS[section];

          const groupedByCategory: Record<string, typeof docs> = {};
          for (const doc of docs) {
            const cat = doc.category || "root";
            if (!groupedByCategory[cat]) {
              groupedByCategory[cat] = [];
            }
            groupedByCategory[cat].push(doc);
          }

          const formatted = Object.entries(groupedByCategory)
            .map(([cat, catDocs]) => {
              const categoryName = cat === "root" ? "Documents" : cat;
              const docList = catDocs.map((d) => `  - ${d.title} (path: ${d.path})`).join("\n");
              return `### ${categoryName}\n\n${docList}`;
            })
            .join("\n\n");

          return {
            content: [
              {
                type: "text",
                text: `# ${config.name} Documentation\n\n${config.description}\n\nTotal: ${docs.length} documents${category ? ` (filtered by: ${category})` : ""}\n\n${formatted}\n\n## Usage\n\nUse get_doc with section="${section}" and the path to get document content.`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching docs list: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

export const getDocTool: Tool = {
  name: "get_doc",
  description:
    "Get the content of a specific SEED Design document. " +
    "Use list_docs first to see available documents and their paths.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        section: sectionEnum.describe(
          "Documentation section: react, docs, breeze, ai-integration, or lynx",
        ),
        path: z
          .string()
          .describe(
            "Document path (e.g., 'components/button', 'getting-started/installation', 'figma-mcp')",
          ),
      },
      async ({ section, path }) => {
        if (!isValidSection(section)) {
          return {
            content: [
              {
                type: "text",
                text: `Invalid section: ${section}. Valid sections: ${SECTION_IDS.join(", ")}`,
              },
            ],
            isError: true,
          };
        }

        try {
          const content = await fetchDoc(section, path);

          return {
            content: [{ type: "text", text: content }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching document '${path}' from section '${section}': ${error instanceof Error ? error.message : "Unknown error"}\n\nUse list_docs to see available documents.`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

export const getFullDocsTool: Tool = {
  name: "get_full_docs",
  description:
    "Get all documents from a section combined into a single text. " +
    "Useful for comprehensive analysis or when you need complete context.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        section: sectionEnum.describe(
          "Documentation section: react, docs, breeze, ai-integration, or lynx",
        ),
      },
      async ({ section }) => {
        if (!isValidSection(section)) {
          return {
            content: [
              {
                type: "text",
                text: `Invalid section: ${section}. Valid sections: ${SECTION_IDS.join(", ")}`,
              },
            ],
            isError: true,
          };
        }

        try {
          const content = await fetchSectionFull(section);

          return {
            content: [{ type: "text", text: content }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching full docs for section '${section}': ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

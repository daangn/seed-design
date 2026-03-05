import { ResourceTemplate, type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SECTION_IDS, SECTIONS, getSectionOverviewTxtUrl, isValidSection } from "./config.js";
import { fetchDocsList, fetchRootageIndex } from "./fetch.js";
import { getIconServices } from "./tools/icon-tools.js";

export function registerResources(server: McpServer): void {
  server.registerResource(
    "sections",
    "seed-docs://sections",
    {
      title: "SEED Docs Sections",
      description: "List of documentation sections and overview llms.txt URLs.",
      mimeType: "application/json",
    },
    async (uri) => {
      const sections = SECTION_IDS.map((section) => {
        const config = SECTIONS[section];
        return {
          id: section,
          name: config.name,
          description: config.description,
          overviewTxtUrl: getSectionOverviewTxtUrl(section),
          categories: Object.entries(config.categories).map(([id, description]) => ({
            id,
            description,
          })),
        };
      });

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify({ sections }, null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    "section-index",
    new ResourceTemplate("seed-docs://{section}/index", {
      list: async () => ({
        resources: SECTION_IDS.map((section) => ({
          name: `${section} index`,
          uri: `seed-docs://${section}/index`,
          mimeType: "application/json",
          description: `${SECTIONS[section].name} llms.txt index`,
        })),
      }),
      complete: {
        section: (value) => SECTION_IDS.filter((section) => section.startsWith(value)),
      },
    }),
    {
      title: "SEED Docs Section Index",
      description: "Per-section index parsed from llms.txt links.",
      mimeType: "application/json",
    },
    async (uri, { section }) => {
      const normalizedSection = Array.isArray(section) ? section[0] : section;
      if (!normalizedSection || !isValidSection(normalizedSection)) {
        throw new Error(`Invalid section: ${String(section)}`);
      }

      const docs = await fetchDocsList(normalizedSection, { limit: 500 });
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                section: normalizedSection,
                total: docs.total,
                truncated: docs.truncated,
                items: docs.items,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerResource(
    "rootage-index",
    "seed-rootage://index",
    {
      title: "SEED Rootage Index",
      description: "SEED rootage index JSON.",
      mimeType: "application/json",
    },
    async (uri) => {
      const index = await fetchRootageIndex();
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(index, null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    "icon-services",
    "seed-icons://services",
    {
      title: "SEED Icon Services",
      description: "Available service categories for multicolor icons.",
      mimeType: "application/json",
    },
    async (uri) => {
      const services = await getIconServices();
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify({ services }, null, 2),
          },
        ],
      };
    },
  );
}

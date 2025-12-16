import { z } from "zod";
import type { Tool } from "../types.js";

const SEED_BASE_URL = "https://seed-design.io";

interface SearchResult {
  id: string;
  url: string;
  title: string;
  description?: string;
  content?: string;
}

export const searchSeedDocsTool: Tool = {
  name: "search_seed_docs",
  description:
    "Search SEED Design documentation using the official search API. Searches across all documentation including design guidelines, React components, Breeze utilities, and foundation topics.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        query: z
          .string()
          .describe(
            "Search query to find relevant documentation (e.g., 'color', 'button', 'spacing', 'typography')",
          ),
        tag: z
          .enum(["all", "design", "react", "breeze", "lynx"])
          .optional()
          .describe(
            "Filter by documentation category: 'design' (guidelines), 'react' (components), 'breeze' (utilities), 'lynx', or 'all' (default)",
          ),
      },
      async ({ query, tag = "all" }) => {
        try {
          const url = new URL(`${SEED_BASE_URL}/api/search`);
          url.searchParams.set("query", query);
          if (tag !== "all") {
            url.searchParams.set("tag", tag);
          }

          const response = await fetch(url.toString());

          if (!response.ok) {
            throw new Error(`Search API returned ${response.status}`);
          }

          const results = await response.json();

          if (!results || results.length === 0) {
            return {
              content: [
                {
                  type: "text",
                  text: `No results found for "${query}"${tag !== "all" ? ` in ${tag}` : ""}.\n\nTry:\n- Different keywords\n- Broader search terms\n- Remove tag filter`,
                },
              ],
            };
          }

          const formatted = results
            .slice(0, 10)
            .map((r, i) => {
              const parts = [`${i + 1}. **${r.title}**`];
              if (r.description) {
                parts.push(`   ${r.description}`);
              }
              parts.push(`   URL: ${SEED_BASE_URL}${r.url}`);
              if (r.content) {
                const snippet = r.content.slice(0, 200).replace(/\n/g, " ");
                parts.push(`   > ${snippet}${r.content.length > 200 ? "..." : ""}`);
              }
              return parts.join("\n");
            })
            .join("\n\n");

          const tagInfo = tag !== "all" ? ` (filtered by: ${tag})` : "";
          const moreInfo =
            results.length > 10 ? `\n\n_Showing 10 of ${results.length} results_` : "";

          return {
            content: [
              {
                type: "text",
                text: `# Search Results for "${query}"${tagInfo}\n\n${formatted}${moreInfo}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error searching documentation: ${error instanceof Error ? error.message : "Unknown error"}\n\nPlease try again or use specific tools like get_react_component or get_docs_component.`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

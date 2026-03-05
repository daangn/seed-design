import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getSectionDocTxtUrl,
  getSectionOverviewTxtUrl,
  SECTION_IDS,
  SECTIONS,
  type SectionId,
} from "../config.js";
import { DEFAULT_DOC_MAX_CHARS, DEFAULT_LIST_LIMIT, DEFAULT_SEARCH_LIMIT } from "../constants.js";
import { fetchDoc, fetchDocsList, searchDocs } from "../fetch.js";
import { readOnlyAnnotations, toErrorMessage, toErrorResult } from "./utils.js";

const sectionEnum = z.enum(SECTION_IDS as [SectionId, ...SectionId[]]);

const docItemSchema = z.object({
  title: z.string(),
  path: z.string(),
  category: z.string().optional(),
  txtUrl: z.string().url(),
});

const sectionInfoSchema = z.object({
  id: sectionEnum,
  name: z.string(),
  description: z.string(),
  overviewTxtUrl: z.string().url(),
  categories: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
    }),
  ),
});

function getFallbackDocUrl(section: SectionId, path: string): string {
  try {
    return getSectionDocTxtUrl(section, path);
  } catch {
    return getSectionOverviewTxtUrl(section);
  }
}

export function registerDocsTools(server: McpServer): void {
  server.registerTool(
    "list_sections",
    {
      title: "List Documentation Sections",
      description: "List available SEED documentation sections and categories.",
      outputSchema: {
        sections: z.array(sectionInfoSchema),
        error: z.string().optional(),
      },
      annotations: readOnlyAnnotations,
    },
    async () => {
      try {
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
          content: [{ type: "text", text: JSON.stringify({ sections }, null, 2) }],
          structuredContent: { sections },
        };
      } catch (error) {
        return toErrorResult(`Failed to list sections: ${toErrorMessage(error)}`, {
          sections: [] as Array<z.infer<typeof sectionInfoSchema>>,
        });
      }
    },
  );

  server.registerTool(
    "list_docs",
    {
      title: "List Documentation Files",
      description: "List documentation files available in a section from llms.txt indexes.",
      inputSchema: {
        section: sectionEnum.describe("Section id."),
        category: z.string().optional().describe("Optional category in the section."),
        limit: z
          .number()
          .int()
          .positive()
          .max(500)
          .optional()
          .describe(`Maximum number of docs to return. Default: ${DEFAULT_LIST_LIMIT}`),
      },
      outputSchema: {
        section: sectionEnum,
        category: z.string().optional(),
        items: z.array(docItemSchema),
        total: z.number().int().nonnegative(),
        truncated: z.boolean(),
        error: z.string().optional(),
      },
      annotations: readOnlyAnnotations,
    },
    async ({ section, category, limit }) => {
      try {
        const result = await fetchDocsList(section, {
          category,
          limit: limit ?? DEFAULT_LIST_LIMIT,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  section,
                  category,
                  total: result.total,
                  truncated: result.truncated,
                  items: result.items,
                },
                null,
                2,
              ),
            },
          ],
          structuredContent: {
            section,
            category,
            items: result.items,
            total: result.total,
            truncated: result.truncated,
          },
        };
      } catch (error) {
        return toErrorResult(
          `Failed to list docs for section '${section}': ${toErrorMessage(error)}`,
          {
            section,
            category,
            items: [],
            total: 0,
            truncated: false,
          },
        );
      }
    },
  );

  server.registerTool(
    "search_docs",
    {
      title: "Search Documentation",
      description: "Search docs by title/path from llms.txt document index.",
      inputSchema: {
        query: z.string().min(1).describe("Search query."),
        section: sectionEnum.optional().describe("Optional section filter."),
        category: z.string().optional().describe("Optional category filter."),
        limit: z
          .number()
          .int()
          .positive()
          .max(200)
          .optional()
          .describe(`Maximum results. Default: ${DEFAULT_SEARCH_LIMIT}`),
      },
      outputSchema: {
        query: z.string(),
        results: z.array(
          z.object({
            section: sectionEnum,
            title: z.string(),
            path: z.string(),
            category: z.string().optional(),
            txtUrl: z.string().url(),
            score: z.number().int().nonnegative(),
          }),
        ),
        total: z.number().int().nonnegative(),
        truncated: z.boolean(),
        error: z.string().optional(),
      },
      annotations: readOnlyAnnotations,
    },
    async ({ query, section, category, limit }) => {
      try {
        const result = await searchDocs(query, {
          section,
          category,
          limit: limit ?? DEFAULT_SEARCH_LIMIT,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query,
                  total: result.total,
                  truncated: result.truncated,
                  results: result.results,
                },
                null,
                2,
              ),
            },
          ],
          structuredContent: {
            query,
            results: result.results,
            total: result.total,
            truncated: result.truncated,
          },
        };
      } catch (error) {
        return toErrorResult(
          `Failed to search docs for query '${query}': ${toErrorMessage(error)}`,
          {
            query,
            results: [],
            total: 0,
            truncated: false,
          },
        );
      }
    },
  );

  server.registerTool(
    "read_doc",
    {
      title: "Read Documentation File",
      description: "Read one llms.txt-backed documentation file as plain text. HTML is rejected.",
      inputSchema: {
        section: sectionEnum.describe("Section id."),
        path: z.string().describe("Document path in the section, without .txt extension."),
        maxChars: z
          .number()
          .int()
          .positive()
          .max(200_000)
          .optional()
          .describe(`Maximum number of characters to return. Default: ${DEFAULT_DOC_MAX_CHARS}`),
      },
      outputSchema: {
        section: sectionEnum,
        path: z.string(),
        txtUrl: z.string().url(),
        content: z.string(),
        truncated: z.boolean(),
        contentType: z.string(),
        error: z.string().optional(),
      },
      annotations: readOnlyAnnotations,
    },
    async ({ section, path, maxChars }) => {
      const txtUrl = getFallbackDocUrl(section, path);

      try {
        const doc = await fetchDoc(section, path, maxChars ?? DEFAULT_DOC_MAX_CHARS);
        return {
          content: [{ type: "text", text: doc.content }],
          structuredContent: {
            section,
            path,
            txtUrl: doc.txtUrl,
            content: doc.content,
            truncated: doc.truncated,
            contentType: doc.contentType,
          },
        };
      } catch (error) {
        return toErrorResult(
          `Failed to read doc '${path}' from '${section}': ${toErrorMessage(error)}`,
          {
            section,
            path,
            txtUrl,
            content: "",
            truncated: false,
            contentType: "text/plain",
          },
        );
      }
    },
  );

  server.registerTool(
    "read_docs_batch",
    {
      title: "Read Multiple Documentation Files",
      description:
        "Read multiple llms.txt-backed documentation files in one call. HTML responses are rejected.",
      inputSchema: {
        items: z
          .array(
            z.object({
              section: sectionEnum,
              path: z.string(),
            }),
          )
          .min(1)
          .max(50),
        maxCharsPerDoc: z
          .number()
          .int()
          .positive()
          .max(200_000)
          .optional()
          .describe(`Maximum number of characters per document. Default: ${DEFAULT_DOC_MAX_CHARS}`),
      },
      outputSchema: {
        docs: z.array(
          z.object({
            section: sectionEnum,
            path: z.string(),
            txtUrl: z.string().url(),
            content: z.string(),
            truncated: z.boolean(),
            error: z.string().optional(),
          }),
        ),
        successCount: z.number().int().nonnegative(),
        errorCount: z.number().int().nonnegative(),
        error: z.string().optional(),
      },
      annotations: readOnlyAnnotations,
    },
    async ({ items, maxCharsPerDoc }) => {
      try {
        const docs = await Promise.all(
          items.map(async (item) => {
            const txtUrl = getFallbackDocUrl(item.section, item.path);
            try {
              const doc = await fetchDoc(
                item.section,
                item.path,
                maxCharsPerDoc ?? DEFAULT_DOC_MAX_CHARS,
              );
              return {
                section: item.section,
                path: item.path,
                txtUrl: doc.txtUrl,
                content: doc.content,
                truncated: doc.truncated,
              };
            } catch (error) {
              return {
                section: item.section,
                path: item.path,
                txtUrl,
                content: "",
                truncated: false,
                error: toErrorMessage(error),
              };
            }
          }),
        );

        const successCount = docs.filter((doc) => !doc.error).length;
        const errorCount = docs.length - successCount;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  successCount,
                  errorCount,
                  docs: docs.map((doc) => ({
                    ...doc,
                    content: doc.content ? `${doc.content.slice(0, 500)}...` : "",
                  })),
                },
                null,
                2,
              ),
            },
          ],
          structuredContent: {
            docs,
            successCount,
            errorCount,
          },
        };
      } catch (error) {
        return toErrorResult(`Failed to read docs batch: ${toErrorMessage(error)}`, {
          docs: [],
          successCount: 0,
          errorCount: items.length,
        });
      }
    },
  );
}

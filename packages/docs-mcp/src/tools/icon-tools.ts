import { createRequire } from "node:module";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getDocsBaseUrl } from "../runtime-config.js";
import type { IconDetails, IconEntry, IconIndex, IconSearchResult, IconUsage } from "../types.js";
import { READ_ONLY_ANNOTATIONS, toErrorMessage, toErrorResult } from "./utils.js";

const ICON_DOCS_PATH = "/docs/foundation/iconography/library";

function getIconDocsBaseUrl(): string {
  return `${getDocsBaseUrl()}${ICON_DOCS_PATH}`;
}

interface RawIconData {
  name: string;
  svg: string;
  metadatas: string[];
  figma: {
    name: string;
    key: string;
    description: string;
  };
  png: {
    "1x": string;
    "2x": string;
    "3x": string;
    "4x": string;
  };
}

function extractVariant(iconName: string): "line" | "fill" | undefined {
  if (iconName.endsWith("_line")) return "line";
  if (iconName.endsWith("_fill")) return "fill";
  return undefined;
}

function extractService(metadatas: string[]): string | undefined {
  const serviceTag = metadatas.find((metadata) => metadata.startsWith("service:"));
  return serviceTag?.replace("service:", "");
}

function filterMetadatas(metadatas: string[]): string[] {
  return metadatas.filter(
    (metadata) => !metadata.startsWith("service:") && !metadata.startsWith("tag:"),
  );
}

function processIcons(
  data: Record<string, RawIconData>,
  type: "monochrome" | "multicolor",
): IconEntry[] {
  return Object.values(data).map((icon) => {
    const entry: IconEntry = {
      name: icon.name,
      metadatas: filterMetadatas(icon.metadatas),
    };

    if (type === "monochrome") {
      const variant = extractVariant(icon.name);
      if (variant) {
        entry.variant = variant;
      }
    } else {
      const service = extractService(icon.metadatas);
      if (service) {
        entry.service = service;
      }
    }

    return entry;
  });
}

let iconDataCache: IconIndex | null = null;

export async function loadIconData(): Promise<IconIndex> {
  if (iconDataCache) {
    return iconDataCache;
  }

  const require = createRequire(import.meta.url);

  const monochromeData: Record<
    string,
    RawIconData
  > = require("@karrotmarket/icon-data/monochrome.json");
  const multicolorData: Record<
    string,
    RawIconData
  > = require("@karrotmarket/icon-data/multicolor.json");

  iconDataCache = {
    version: "runtime",
    generatedAt: new Date().toISOString(),
    monochrome: processIcons(monochromeData, "monochrome"),
    multicolor: processIcons(multicolorData, "multicolor"),
  };

  return iconDataCache;
}

function toComponentName(iconName: string): string {
  return iconName
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function getIconUsage(iconName: string, type: "monochrome" | "multicolor"): IconUsage[] {
  const componentName = toComponentName(iconName);
  const iconType = type === "monochrome" ? "monochrome-icon" : "multicolor-icon";
  const frameworks = ["react", "vue", "lynx"] as const;

  return frameworks.map((framework) => {
    const pkg = `@karrotmarket/${framework}-${iconType}`;
    return {
      framework,
      package: pkg,
      import: `import { ${componentName} } from "${pkg}"`,
      component: `<${componentName} />`,
    };
  });
}

function searchIcons(
  iconData: IconIndex,
  query: string,
  type?: "monochrome" | "multicolor",
  limit = 20,
): IconSearchResult[] {
  const normalizedQuery = query.toLowerCase();
  const results: IconSearchResult[] = [];

  const searchInType = (icons: IconEntry[], iconType: "monochrome" | "multicolor") => {
    for (const icon of icons) {
      const nameMatch = icon.name.toLowerCase().includes(normalizedQuery);
      const matchedKeywords = icon.metadatas.filter(
        (metadata) =>
          metadata.toLowerCase().includes(normalizedQuery) ||
          normalizedQuery.includes(metadata.toLowerCase()),
      );

      if (!nameMatch && matchedKeywords.length === 0) {
        continue;
      }

      results.push({
        name: icon.name,
        type: iconType,
        variant: icon.variant,
        service: icon.service,
        matchedKeywords: nameMatch ? [icon.name, ...matchedKeywords] : matchedKeywords,
        allKeywords: icon.metadatas,
      });
    }
  };

  if (!type || type === "monochrome") {
    searchInType(iconData.monochrome, "monochrome");
  }
  if (!type || type === "multicolor") {
    searchInType(iconData.multicolor, "multicolor");
  }

  results.sort((a, b) => b.matchedKeywords.length - a.matchedKeywords.length);
  return results.slice(0, limit);
}

function findIcon(iconData: IconIndex, iconName: string): IconDetails | null {
  const monochrome = iconData.monochrome.find((icon) => icon.name === iconName);
  if (monochrome) {
    return {
      name: monochrome.name,
      type: "monochrome",
      keywords: monochrome.metadatas,
      variant: monochrome.variant,
      docsUrl: `${getIconDocsBaseUrl()}?icon=${iconName}`,
      usage: getIconUsage(iconName, "monochrome"),
    };
  }

  const multicolor = iconData.multicolor.find((icon) => icon.name === iconName);
  if (multicolor) {
    return {
      name: multicolor.name,
      type: "multicolor",
      keywords: multicolor.metadatas,
      service: multicolor.service,
      docsUrl: `${getIconDocsBaseUrl()}?icon=${iconName}`,
      usage: getIconUsage(iconName, "multicolor"),
    };
  }

  return null;
}

function getAvailableServices(iconData: IconIndex): string[] {
  const services = new Set<string>();
  for (const icon of iconData.multicolor) {
    if (icon.service) {
      services.add(icon.service);
    }
  }
  return Array.from(services).sort();
}

export async function getIconServices(): Promise<string[]> {
  const iconData = await loadIconData();
  return getAvailableServices(iconData);
}

export function registerIconTools(server: McpServer): void {
  server.registerTool(
    "list_icons",
    {
      title: "List Icons",
      description: "List SEED icons with optional type, variant, and service filtering.",
      inputSchema: {
        type: z.enum(["monochrome", "multicolor"]).optional(),
        variant: z.enum(["line", "fill"]).optional(),
        service: z.string().optional(),
        limit: z.number().int().positive().max(200).optional().default(50),
      },
      outputSchema: {
        totalCount: z.number().int().nonnegative(),
        returnedCount: z.number().int().nonnegative(),
        icons: z.array(
          z.object({
            name: z.string(),
            type: z.enum(["monochrome", "multicolor"]),
            variant: z.enum(["line", "fill"]).optional(),
            service: z.string().optional(),
            keywords: z.array(z.string()),
          }),
        ),
        availableServices: z.array(z.string()),
        error: z.string().optional(),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async ({ type, variant, service, limit }) => {
      try {
        const iconData = await loadIconData();
        const allIcons = [
          ...(type === "multicolor"
            ? []
            : iconData.monochrome.map((icon) => ({
                name: icon.name,
                type: "monochrome" as const,
                variant: icon.variant,
                service: undefined,
                keywords: icon.metadatas,
              }))),
          ...(type === "monochrome"
            ? []
            : iconData.multicolor.map((icon) => ({
                name: icon.name,
                type: "multicolor" as const,
                variant: undefined,
                service: icon.service,
                keywords: icon.metadatas,
              }))),
        ]
          .filter((icon) => (variant ? icon.variant === variant : true))
          .filter((icon) => (service ? icon.service === service : true));

        const cappedLimit = Math.max(1, Math.min(limit ?? 50, 200));
        const icons = allIcons.slice(0, cappedLimit);
        const availableServices = getAvailableServices(iconData);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  totalCount: allIcons.length,
                  returnedCount: icons.length,
                  icons,
                  availableServices,
                },
                null,
                2,
              ),
            },
          ],
          structuredContent: {
            totalCount: allIcons.length,
            returnedCount: icons.length,
            icons,
            availableServices,
          },
        };
      } catch (error) {
        return toErrorResult(`Failed to list icons: ${toErrorMessage(error)}`, {
          totalCount: 0,
          returnedCount: 0,
          icons: [],
          availableServices: [],
        });
      }
    },
  );

  server.registerTool(
    "search_icons",
    {
      title: "Search Icons",
      description: "Search icons by keyword in icon names and metadata.",
      inputSchema: {
        query: z.string().min(1),
        type: z.enum(["monochrome", "multicolor"]).optional(),
        limit: z.number().int().positive().max(100).optional().default(20),
      },
      outputSchema: {
        query: z.string(),
        results: z.array(
          z.object({
            name: z.string(),
            type: z.enum(["monochrome", "multicolor"]),
            variant: z.enum(["line", "fill"]).optional(),
            service: z.string().optional(),
            matchedKeywords: z.array(z.string()),
            allKeywords: z.array(z.string()),
          }),
        ),
        searchUrl: z.string().url(),
        error: z.string().optional(),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async ({ query, type, limit }) => {
      try {
        const iconData = await loadIconData();
        const cappedLimit = Math.max(1, Math.min(limit ?? 20, 100));
        const results = searchIcons(iconData, query, type, cappedLimit);
        const searchUrl = `${getIconDocsBaseUrl()}?search=${encodeURIComponent(query)}`;

        return {
          content: [{ type: "text", text: JSON.stringify({ query, searchUrl, results }, null, 2) }],
          structuredContent: {
            query,
            results,
            searchUrl,
          },
        };
      } catch (error) {
        return toErrorResult(`Failed to search icons: ${toErrorMessage(error)}`, {
          query,
          results: [],
          searchUrl: `${getIconDocsBaseUrl()}?search=${encodeURIComponent(query)}`,
        });
      }
    },
  );

  server.registerTool(
    "read_icon",
    {
      title: "Read Icon Details",
      description: "Read icon details and import snippets for supported frameworks.",
      inputSchema: {
        iconName: z.string().min(1),
      },
      outputSchema: {
        icon: z
          .object({
            name: z.string(),
            type: z.enum(["monochrome", "multicolor"]),
            keywords: z.array(z.string()),
            variant: z.enum(["line", "fill"]).optional(),
            service: z.string().optional(),
            docsUrl: z.string().url(),
            usage: z.array(
              z.object({
                framework: z.string(),
                package: z.string(),
                import: z.string(),
                component: z.string(),
              }),
            ),
          })
          .nullable(),
        suggestions: z.array(z.string()),
        error: z.string().optional(),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async ({ iconName }) => {
      try {
        const iconData = await loadIconData();
        const icon = findIcon(iconData, iconName);
        if (!icon) {
          const suggestions = searchIcons(iconData, iconName, undefined, 5).map(
            (result) => result.name,
          );
          const message = `Icon '${iconName}' not found.`;
          return {
            content: [{ type: "text", text: JSON.stringify({ icon: null, suggestions }, null, 2) }],
            structuredContent: {
              icon: null,
              suggestions,
              error: message,
            },
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: JSON.stringify({ icon, suggestions: [] }, null, 2) }],
          structuredContent: {
            icon,
            suggestions: [],
          },
        };
      } catch (error) {
        return toErrorResult(`Failed to read icon details: ${toErrorMessage(error)}`, {
          icon: null,
          suggestions: [],
        });
      }
    },
  );
}

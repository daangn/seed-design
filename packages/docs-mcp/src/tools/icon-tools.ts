/**
 * Icon Tools for SEED Design MCP Server
 *
 * Provides tools for discovering and searching SEED Design icons.
 * Icon data is loaded at runtime from @karrotmarket/icon-data package.
 */

import { z } from "zod";
import { createRequire } from "node:module";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Tool, IconIndex, IconEntry, IconSearchResult } from "../types.js";

const DOCS_BASE_URL = "https://seed-design.io/docs/foundation/iconography/library";

// ============================================================================
// Runtime Icon Data Loading
// ============================================================================

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
  const serviceTag = metadatas.find((m) => m.startsWith("service:"));
  if (serviceTag) {
    return serviceTag.replace("service:", "");
  }
  return undefined;
}

function filterMetadatas(metadatas: string[]): string[] {
  return metadatas.filter((m) => !m.startsWith("service:") && !m.startsWith("tag:"));
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

// Module-level cache for icon data (loaded once, shared across all tools)
let iconDataCache: IconIndex | null = null;

/**
 * Load icon data from @karrotmarket/icon-data package at runtime.
 * Strips SVG/PNG data and keeps only searchable metadata.
 */
async function loadIconData(): Promise<IconIndex> {
  if (iconDataCache) {
    return iconDataCache;
  }

  const require = createRequire(import.meta.url);

  try {
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
  } catch (error) {
    throw new Error(
      `Failed to load icon data from @karrotmarket/icon-data: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

// ============================================================================
// Icon Tool Context
// ============================================================================

interface IconToolContext {
  iconData: IconIndex;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert icon name to React component name
 * e.g., "icon_arrow_left_line" -> "IconArrowLeftLine"
 */
function toComponentName(iconName: string): string {
  return iconName
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Get usage information for an icon across all frameworks
 */
function getIconUsage(iconName: string, type: "monochrome" | "multicolor") {
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

/**
 * Search icons by query (matches name and metadata)
 */
function searchIcons(
  iconData: IconIndex,
  query: string,
  type?: "monochrome" | "multicolor",
  limit = 20,
): IconSearchResult[] {
  const queryLower = query.toLowerCase();
  const results: IconSearchResult[] = [];

  const searchInType = (icons: IconEntry[], iconType: "monochrome" | "multicolor") => {
    for (const icon of icons) {
      const nameMatch = icon.name.toLowerCase().includes(queryLower);
      const matchedKeywords = icon.metadatas.filter(
        (m) => m.toLowerCase().includes(queryLower) || queryLower.includes(m.toLowerCase()),
      );

      if (nameMatch || matchedKeywords.length > 0) {
        results.push({
          name: icon.name,
          type: iconType,
          variant: icon.variant,
          service: icon.service,
          matchedKeywords: nameMatch ? [icon.name, ...matchedKeywords] : matchedKeywords,
          allKeywords: icon.metadatas,
        });
      }
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

interface IconDetailsInternal {
  name: string;
  type: "monochrome" | "multicolor";
  keywords: string[];
  variant?: "line" | "fill";
  service?: string;
  docsUrl: string;
  usage: Array<{
    framework: string;
    package: string;
    import: string;
    component: string;
  }>;
}

/**
 * Find an icon by name and return its details
 */
function findIcon(iconData: IconIndex, iconName: string): IconDetailsInternal | null {
  const monoIcon = iconData.monochrome.find((i) => i.name === iconName);
  if (monoIcon) {
    return {
      name: monoIcon.name,
      type: "monochrome",
      keywords: monoIcon.metadatas,
      variant: monoIcon.variant,
      docsUrl: `${DOCS_BASE_URL}?icon=${iconName}`,
      usage: getIconUsage(iconName, "monochrome"),
    };
  }

  const multiIcon = iconData.multicolor.find((i) => i.name === iconName);
  if (multiIcon) {
    return {
      name: multiIcon.name,
      type: "multicolor",
      keywords: multiIcon.metadatas,
      service: multiIcon.service,
      docsUrl: `${DOCS_BASE_URL}?icon=${iconName}`,
      usage: getIconUsage(iconName, "multicolor"),
    };
  }

  return null;
}

/**
 * List icons with filtering
 */
function listIcons(
  iconData: IconIndex,
  type?: "monochrome" | "multicolor",
  variant?: "line" | "fill",
  service?: string,
  limit = 50,
): {
  totalCount: number;
  returnedCount: number;
  icons: Array<{ name: string; variant?: string; service?: string; keywords: string }>;
} {
  let icons: Array<{
    name: string;
    type: "monochrome" | "multicolor";
    variant?: string;
    service?: string;
    metadatas: string[];
  }> = [];

  if (!type || type === "monochrome") {
    icons.push(
      ...iconData.monochrome.map((i) => ({
        name: i.name,
        type: "monochrome" as const,
        variant: i.variant,
        metadatas: i.metadatas,
      })),
    );
  }

  if (!type || type === "multicolor") {
    icons.push(
      ...iconData.multicolor.map((i) => ({
        name: i.name,
        type: "multicolor" as const,
        service: i.service,
        metadatas: i.metadatas,
      })),
    );
  }

  if (variant) {
    icons = icons.filter((i) => i.variant === variant);
  }

  if (service) {
    icons = icons.filter((i) => i.service === service);
  }

  const totalCount = icons.length;
  const limited = icons.slice(0, limit);

  return {
    totalCount,
    returnedCount: limited.length,
    icons: limited.map((i) => ({
      name: i.name,
      variant: i.variant,
      service: i.service,
      keywords: i.metadatas.slice(0, 5).join(", "),
    })),
  };
}

/**
 * Get available services for multicolor icons
 */
function getAvailableServices(iconData: IconIndex): string[] {
  const services = new Set<string>();
  for (const icon of iconData.multicolor) {
    if (icon.service) {
      services.add(icon.service);
    }
  }
  return Array.from(services).sort();
}

// ============================================================================
// MCP Tool Definitions
// ============================================================================

export const listIconsTool: Tool<IconToolContext> = {
  name: "list_icons",
  description:
    "List available SEED Design icons with optional filtering by type, variant, or service",
  async ctx() {
    const iconData = await loadIconData();
    return { iconData };
  },
  exec(server: McpServer, { ctx, name, description }) {
    server.tool(
      name,
      description,
      {
        type: z
          .enum(["monochrome", "multicolor"])
          .optional()
          .describe(
            "Filter by icon type. Monochrome icons are single-color, multicolor are service icons.",
          ),
        variant: z
          .enum(["line", "fill"])
          .optional()
          .describe("Filter monochrome icons by variant (line or fill style)."),
        service: z
          .string()
          .optional()
          .describe(
            "Filter multicolor icons by service category (e.g., '중고거래', '부동산', '알바').",
          ),
        limit: z
          .number()
          .optional()
          .default(50)
          .describe("Maximum number of icons to return (default: 50, max: 200)."),
      },
      async ({ type, variant, service, limit }) => {
        const effectiveLimit = Math.min(limit ?? 50, 200);
        const result = listIcons(ctx.iconData, type, variant, service, effectiveLimit);

        let response = `Found ${result.totalCount} icons`;
        if (type) response += ` (type: ${type})`;
        if (variant) response += ` (variant: ${variant})`;
        if (service) response += ` (service: ${service})`;
        response += `\nShowing ${result.returnedCount} icons:\n\n`;

        for (const icon of result.icons) {
          response += `- ${icon.name}`;
          if (icon.variant) response += ` [${icon.variant}]`;
          if (icon.service) response += ` [${icon.service}]`;
          response += ` — ${icon.keywords}\n`;
        }

        if (result.totalCount > result.returnedCount) {
          response += `\n... and ${result.totalCount - result.returnedCount} more icons.`;
          response += `\nUse search_icons for specific queries or increase limit.`;
        }

        if (!type || type === "multicolor") {
          const services = getAvailableServices(ctx.iconData);
          response += `\n\nAvailable service categories: ${services.join(", ")}`;
        }

        return { content: [{ type: "text", text: response }] };
      },
    );
  },
};

export const searchIconsTool: Tool<IconToolContext> = {
  name: "search_icons",
  description: "Search SEED Design icons by keyword. Supports both English and Korean queries.",
  async ctx() {
    const iconData = await loadIconData();
    return { iconData };
  },
  exec(server: McpServer, { ctx, name, description }) {
    server.tool(
      name,
      description,
      {
        query: z.string().describe("Search query (e.g., 'arrow', 'back', '화살표', 'shopping')"),
        type: z
          .enum(["monochrome", "multicolor"])
          .optional()
          .describe("Optional: filter results by icon type."),
        limit: z
          .number()
          .optional()
          .default(20)
          .describe("Maximum results to return (default: 20, max: 100)."),
      },
      async ({ query, type, limit }) => {
        const effectiveLimit = Math.min(limit ?? 20, 100);
        const results = searchIcons(ctx.iconData, query, type, effectiveLimit);
        const searchUrl = `${DOCS_BASE_URL}?search=${encodeURIComponent(query)}`;

        if (results.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No icons found for "${query}".\n\nTry different keywords or browse all icons:\n${DOCS_BASE_URL}`,
              },
            ],
          };
        }

        let response = `Found ${results.length} icons matching "${query}":\n`;
        response += `View in browser: ${searchUrl}\n\n`;

        for (const icon of results) {
          response += `- ${icon.name} [${icon.type}]`;
          if (icon.variant) response += ` (${icon.variant})`;
          if (icon.service) response += ` (${icon.service})`;
          response += `\n  Matched: ${icon.matchedKeywords.join(", ")}\n`;
        }

        return { content: [{ type: "text", text: response }] };
      },
    );
  },
};

export const getIconDetailsTool: Tool<IconToolContext> = {
  name: "get_icon_details",
  description:
    "Get complete details for a specific SEED icon including React component import and documentation link.",
  async ctx() {
    const iconData = await loadIconData();
    return { iconData };
  },
  exec(server: McpServer, { ctx, name, description }) {
    server.tool(
      name,
      description,
      {
        iconName: z
          .string()
          .describe("The icon name (e.g., 'icon_arrow_left_line', 'icon_shoppingbag_items')"),
      },
      async ({ iconName }) => {
        const icon = findIcon(ctx.iconData, iconName);

        if (!icon) {
          const suggestions = searchIcons(ctx.iconData, iconName, undefined, 5);
          let response = `Icon "${iconName}" not found.\n\n`;

          if (suggestions.length > 0) {
            response += "Did you mean:\n";
            for (const s of suggestions) {
              response += `- ${s.name}\n`;
            }
          }

          return { content: [{ type: "text", text: response }] };
        }

        let response = `# ${icon.name}\n\n`;
        response += `**Type:** ${icon.type}\n`;
        if (icon.variant) response += `**Variant:** ${icon.variant}\n`;
        if (icon.service) response += `**Service:** ${icon.service}\n`;
        response += `**Keywords:** ${icon.keywords.join(", ")}\n\n`;

        response += "## Usage\n\n";

        for (const usage of icon.usage) {
          response += `### ${usage.framework.charAt(0).toUpperCase() + usage.framework.slice(1)}\n`;
          response += `\`\`\`tsx\n${usage.import}\n\n${usage.component}\n\`\`\`\n\n`;
        }

        response += "## Documentation\n\n";
        response += `View this icon: ${icon.docsUrl}\n`;

        return { content: [{ type: "text", text: response }] };
      },
    );
  },
};

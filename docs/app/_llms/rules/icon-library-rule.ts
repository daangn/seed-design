import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Rule } from "./types";
import { escapeCell, markdownRow } from "./markdown-utils";

interface RawIconData {
  name: string;
  metadatas: string[];
  figma?: {
    name?: string;
    key?: string;
    description?: string;
  };
}

interface IconRow {
  name: string;
  figmaName: string;
  keywords: string[];
  services: string[];
  tags: string[];
}

interface IconLibraryData {
  monochrome: IconRow[];
  multicolor: IconRow[];
}

const DATA_DIR_ENV = "ICON_LIBRARY_DATA_DIR";
const SERVICE_PREFIX = "service:";
const TAG_PREFIX = "tag:";

let iconDataCache: IconLibraryData | null = null;

function unique(values: string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    if (!value) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

function splitMetadatas(metadatas: string[]): {
  keywords: string[];
  services: string[];
  tags: string[];
} {
  const keywords: string[] = [];
  const services: string[] = [];
  const tags: string[] = [];

  for (const metadata of metadatas) {
    if (metadata.startsWith(SERVICE_PREFIX)) {
      const value = metadata.slice(SERVICE_PREFIX.length).trim();
      if (value) services.push(value);
      continue;
    }
    if (metadata.startsWith(TAG_PREFIX)) {
      const value = metadata.slice(TAG_PREFIX.length).trim();
      if (value) tags.push(value);
      continue;
    }
    if (metadata.trim()) keywords.push(metadata.trim());
  }

  return {
    keywords: unique(keywords),
    services: unique(services),
    tags: unique(tags),
  };
}

function readIconData(filename: string): Record<string, RawIconData> | null {
  try {
    const customDir = process.env[DATA_DIR_ENV];
    if (customDir) {
      const filePath = join(customDir, filename);
      const content = readFileSync(filePath, "utf-8");
      return JSON.parse(content) as Record<string, RawIconData>;
    }

    // Use process.cwd() as base for module resolution.
    // import.meta.url is unreliable in Next.js bundled environments
    // because webpack transforms it to the output file path.
    const require = createRequire(join(process.cwd(), "__resolve__.js"));
    return require(`@karrotmarket/icon-data/${filename}`) as Record<string, RawIconData>;
  } catch (e) {
    console.warn(`[IconLibrary] Failed to load icon data (${filename}):`, e);
    return null;
  }
}

function toRow(icon: RawIconData): IconRow {
  const { keywords, services, tags } = splitMetadatas(icon.metadatas ?? []);

  return {
    name: icon.name,
    figmaName: icon.figma?.name ?? "",
    keywords,
    services,
    tags,
  };
}

function loadIconLibraryData(): IconLibraryData | null {
  if (iconDataCache) return iconDataCache;

  const monochromeData = readIconData("monochrome.json");
  const multicolorData = readIconData("multicolor.json");

  if (!monochromeData || !multicolorData) return null;

  const monochrome = Object.values(monochromeData)
    .map(toRow)
    .sort((a, b) => a.name.localeCompare(b.name));
  const multicolor = Object.values(multicolorData)
    .map(toRow)
    .sort((a, b) => a.name.localeCompare(b.name));

  iconDataCache = { monochrome, multicolor };
  return iconDataCache;
}

function formatList(values: string[]): string {
  return values.join(", ");
}

function buildTable(rows: IconRow[]): string {
  const headers = ["Icon Name", "Figma Name", "Keywords", "Services", "Tags"];
  const separator = headers.map(() => "---");
  const bodyRows = rows.map((row) =>
    markdownRow([
      escapeCell(row.name),
      escapeCell(row.figmaName),
      escapeCell(formatList(row.keywords)),
      escapeCell(formatList(row.services)),
      escapeCell(formatList(row.tags)),
    ]),
  );

  return [markdownRow(headers), markdownRow(separator), ...bodyRows].join("\n");
}

function buildSection(title: string, rows: IconRow[]): string | null {
  if (rows.length === 0) return null;
  return `## ${title}\n\n${buildTable(rows)}`;
}

export const iconLibraryRule: Rule = {
  name: "IconLibrary",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "IconLibrary",
  transform: (node) => {
    try {
      const data = loadIconLibraryData();
      if (!data) return [node];

      const sections = [
        buildSection("Monochrome Icons", data.monochrome),
        buildSection("Multicolor Icons", data.multicolor),
      ].filter((section): section is string => Boolean(section));

      if (sections.length === 0) return [node];

      return [{ type: "html", value: sections.join("\n\n") }];
    } catch {
      return [node];
    }
  },
};

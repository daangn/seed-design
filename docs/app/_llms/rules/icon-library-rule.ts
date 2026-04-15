import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Rule } from "./types";
import { escapeCell, markdownRow } from "./markdown-utils";
import monochromeRaw from "@karrotmarket/icon-data/monochrome.json";
import multicolorRaw from "@karrotmarket/icon-data/multicolor.json";

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
  componentName: string;
  figmaName: string;
  keywords: string[];
  services: string[];
  tags: string[];
}

const SERVICE_PREFIX = "service:";
const TAG_PREFIX = "tag:";

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

function toComponentName(iconName: string): string {
  return iconName
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toRow(icon: RawIconData): IconRow {
  const { keywords, services, tags } = splitMetadatas(icon.metadatas ?? []);

  return {
    name: icon.name,
    componentName: toComponentName(icon.name),
    figmaName: icon.figma?.name ?? "",
    keywords,
    services,
    tags,
  };
}

const monochrome = Object.values(monochromeRaw as Record<string, RawIconData>)
  .map(toRow)
  .sort((a, b) => a.name.localeCompare(b.name));

const multicolor = Object.values(multicolorRaw as Record<string, RawIconData>)
  .map(toRow)
  .sort((a, b) => a.name.localeCompare(b.name));

function formatList(values: string[]): string {
  return values.join(", ");
}

function buildTable(rows: IconRow[]): string {
  const headers = ["Icon Name", "React Component", "Figma Name", "Keywords", "Services", "Tags"];
  const separator = headers.map(() => "---");
  const bodyRows = rows.map((row) =>
    markdownRow([
      escapeCell(row.name),
      escapeCell(row.componentName),
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
      const sections = [
        buildSection("Monochrome Icons", monochrome),
        buildSection("Multicolor Icons", multicolor),
      ].filter((section): section is string => Boolean(section));

      if (sections.length === 0) return [node];

      return [{ type: "html", value: sections.join("\n\n") }];
    } catch {
      return [node];
    }
  },
};

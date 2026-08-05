import monochromeRaw from "@karrotmarket/icon-data/monochrome.json" with { type: "json" };
import multicolorRaw from "@karrotmarket/icon-data/multicolor.json" with { type: "json" };
import { escapeCell, markdownRow } from "../markdown-table";
import type { LLMHandler } from "../types";

export interface RawIconData {
  name: string;
  metadatas: string[];
  figma?: {
    name?: string;
    key?: string;
    description?: string;
  };
}

export interface IconRow {
  name: string;
  reactComponentName: string;
  figmaName: string;
  keywords: string[];
  services: string[];
  tags: string[];
}

function toComponentName(iconName: string): string {
  return iconName
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
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

export function toRow(icon: RawIconData): IconRow {
  const { keywords, services, tags } = splitMetadatas(icon.metadatas ?? []);

  return {
    name: icon.name,
    reactComponentName: toComponentName(icon.name),
    figmaName: icon.figma?.name ?? "",
    keywords,
    services,
    tags,
  };
}

function toSortedRows(icons: readonly RawIconData[]): IconRow[] {
  return icons.map(toRow).sort((a, b) => a.name.localeCompare(b.name));
}

function buildTable(rows: IconRow[]): string {
  const headers = [
    "Icon Name",
    "React Component Name",
    "Figma Name",
    "Keywords",
    "Services",
    "Tags",
  ];
  const bodyRows = rows.map((row) =>
    markdownRow([
      escapeCell(row.name),
      escapeCell(row.reactComponentName),
      escapeCell(row.figmaName),
      escapeCell(row.keywords.join(", ")),
      escapeCell(row.services.join(", ")),
      escapeCell(row.tags.join(", ")),
    ]),
  );

  return [markdownRow(headers), markdownRow(headers.map(() => "---")), ...bodyRows].join("\n");
}

export function buildSection(title: string, rows: IconRow[]): string | null {
  if (rows.length === 0) return null;

  return `## ${title}\n\n${buildTable(rows)}`;
}

/**
 * `<IconLibrary />`를 아이콘 카탈로그 표로 바꾼다. 아이콘 이름·React 컴포넌트 이름·
 * Figma 이름과 검색에 쓰는 키워드/서비스/태그를 세트별 `##` 절로 나눠 싣는다.
 *
 * 두 세트가 모두 비면 태그를 그대로 남긴다 — 이 페이지는 본문이 이 표뿐이라, 지우면
 * 아이콘을 찾을 단서가 llms 출력에서 통째로 사라진다.
 *
 * 아이콘 데이터를 인자로 받는다. 테스트는 합성 데이터로 핸들러를 만들어 실제 아이콘
 * 목록에 묶이지 않게 한다.
 */
export function createIconLibraryHandler(
  monochrome: readonly RawIconData[],
  multicolor: readonly RawIconData[],
): LLMHandler {
  const monochromeRows = toSortedRows(monochrome);
  const multicolorRows = toSortedRows(multicolor);

  return {
    names: ["IconLibrary"],
    render: () => {
      const sections = [
        buildSection("Monochrome Icons", monochromeRows),
        buildSection("Multicolor Icons", multicolorRows),
      ].filter((section): section is string => Boolean(section));

      return sections.length > 0 ? sections.join("\n\n") : undefined;
    },
  };
}

export const iconLibraryHandler = createIconLibraryHandler(
  Object.values(monochromeRaw as Record<string, RawIconData>),
  Object.values(multicolorRaw as Record<string, RawIconData>),
);

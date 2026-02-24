import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { ComponentData, PlatformStatus } from "../../../sanity-studio/lib/types";
import type { Rule } from "./types";

const platformConfig = [
  { key: "figma" as const, label: "Figma" },
  { key: "react" as const, label: "React" },
  { key: "ios" as const, label: "iOS" },
  { key: "android" as const, label: "Android" },
] as const;

const statusLabel: Record<PlatformStatus, string> = {
  ready: "Done",
  "in-progress": "In Progress",
  "not-ready": "Not Ready",
  deprecated: "Deprecated",
  "not-planned": "Not Planned",
};

type Row = Record<string, string>;

const columnDefs: { key: string; header: string }[] = [
  { key: "platform", header: "Platform" },
  { key: "status", header: "Status" },
  { key: "note", header: "Note" },
];

function generateMarkdownTable(component: ComponentData): string {
  const rows: Row[] = platformConfig.map(({ key, label }) => {
    const status = component[`${key}Status`] as PlatformStatus;
    const url = component[`${key}Url`] as string | undefined;
    const note = component[`${key}Note`] as string | undefined;

    return {
      platform: url ? `[${label}](${url})` : label,
      status: statusLabel[status] ?? "Not Ready",
      note: note ?? "",
    };
  });

  const activeColumns = columnDefs.filter(({ key }) => rows.some((row) => row[key]));
  const formatRow = (cells: string[]) => `| ${cells.join(" | ")} |`;

  return [
    formatRow(activeColumns.map((col) => col.header)),
    formatRow(activeColumns.map(() => "---")),
    ...rows.map((row) => formatRow(activeColumns.map((col) => row[col.key]))),
  ].join("\n");
}

let componentDataCache: Map<string, ComponentData> | null = null;

function loadComponentData(): Map<string, ComponentData> {
  if (componentDataCache) return componentDataCache;

  componentDataCache = new Map();

  try {
    const filePath = join(process.cwd(), "public/sanity/components.json");
    const content = readFileSync(filePath, "utf-8");
    const components = JSON.parse(content) as ComponentData[];
    for (const component of components) {
      componentDataCache.set(component.id, component);
    }
  } catch {
    // 파일을 읽지 못하면 빈 캐시 반환
  }

  return componentDataCache;
}

export const platformStatusRule: Rule = {
  name: "PlatformStatusTable",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "PlatformStatusTable",
  transform: (node, { getStringAttribute }) => {
    const componentId = getStringAttribute(node, "componentId");
    if (!componentId) throw new Error("PlatformStatusTable: missing componentId");

    const componentData = loadComponentData();
    const component = componentData.get(componentId);
    if (!component) throw new Error(`PlatformStatusTable: component not found: ${componentId}`);

    return [{ type: "html", value: generateMarkdownTable(component) }];
  },
};

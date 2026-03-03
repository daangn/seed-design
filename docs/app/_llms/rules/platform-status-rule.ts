import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../../../sanity-studio/env";
import { ALL_COMPONENTS_QUERY } from "../../../sanity-studio/lib/queries";
import type { ComponentData, PlatformStatus } from "../../../sanity-studio/lib/types";
import type { Rule } from "./types";
import { escapeCell, markdownRow } from "./markdown-utils";

const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn: false });

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
      platform: url ? `[${label}](${escapeCell(url)})` : label,
      status: statusLabel[status] ?? "Not Ready",
      note: note ? escapeCell(note) : "",
    };
  });

  const activeColumns = columnDefs.filter(({ key }) => rows.some((row) => row[key]));

  return [
    markdownRow(activeColumns.map((col) => col.header)),
    markdownRow(activeColumns.map(() => "---")),
    ...rows.map((row) => markdownRow(activeColumns.map((col) => row[col.key]))),
  ].join("\n");
}

let componentDataCache: Map<string, ComponentData> | null = null;
let initPromise: Promise<void> | null = null;

async function fetchAndCacheComponentData(): Promise<void> {
  const cache = new Map<string, ComponentData>();
  try {
    const components = await sanityClient.fetch<ComponentData[]>(ALL_COMPONENTS_QUERY);
    for (const component of components) {
      cache.set(component.id, component);
    }
  } catch {
    // Sanity fetch 실패 시 빈 캐시 사용
  }
  componentDataCache = cache;
}

async function init(): Promise<void> {
  if (!initPromise) {
    initPromise = fetchAndCacheComponentData();
  }
  await initPromise;
}

export const platformStatusRule: Rule = {
  name: "PlatformStatusTable",
  init,
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "PlatformStatusTable",
  transform: (node, { getStringAttribute }) => {
    const componentId = getStringAttribute(node, "componentId");
    if (!componentId) return [node];

    if (!componentDataCache) return [node];

    const component = componentDataCache.get(componentId);
    if (!component) return [node];

    return [{ type: "html", value: generateMarkdownTable(component) }];
  },
};

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

function formatStatusCell(component: ComponentData, key: (typeof platformConfig)[number]["key"]) {
  const status = component[`${key}Status`] as PlatformStatus | undefined;
  const url = component[`${key}Url`] as string | undefined;
  const note = component[`${key}Note`] as string | undefined;

  const label = status ? statusLabel[status] : undefined;
  if (!label) return "";

  const base = url ? `[${label}](${escapeCell(url)})` : label;
  return note ? `${base} (${escapeCell(note)})` : base;
}

function buildSummaryTable(components: ComponentData[]): string {
  const headers = ["Platform", "Progress", "Ready/Total"];
  const rows = platformConfig.map(({ key, label }) => {
    const statusKey = `${key}Status` as keyof ComponentData;
    const planned = components.filter((c) => c[statusKey] !== "not-planned");
    const ready = planned.filter((c) => c[statusKey] === "ready").length;
    const total = planned.length;
    const percentage = total === 0 ? 0 : Math.round((ready / total) * 100);

    return markdownRow([label, `${percentage}%`, `${ready}/${total}`]);
  });

  return [markdownRow(headers), markdownRow(headers.map(() => "---")), ...rows].join("\n");
}

function buildComponentTable(components: ComponentData[]): string {
  const headers = ["Component", ...platformConfig.map(({ label }) => label)];
  const rows = components.map((component) =>
    markdownRow([
      escapeCell(component.name),
      ...platformConfig.map(({ key }) => formatStatusCell(component, key)),
    ]),
  );

  return [markdownRow(headers), markdownRow(headers.map(() => "---")), ...rows].join("\n");
}

function buildProgressBoardContent(components: ComponentData[]): string {
  return [
    "### 플랫폼별 진행률",
    buildSummaryTable(components),
    "### 컴포넌트별 상태",
    buildComponentTable(components),
  ].join("\n\n");
}

let componentsCache: ComponentData[] | null = null;
let initPromise: Promise<void> | null = null;

async function fetchAndCacheComponents(): Promise<void> {
  try {
    componentsCache = await sanityClient.fetch<ComponentData[]>(ALL_COMPONENTS_QUERY);
  } catch {
    componentsCache = [];
  }
}

async function init(): Promise<void> {
  if (!initPromise) {
    initPromise = fetchAndCacheComponents();
  }
  await initPromise;
}

export function __setComponentsCacheForTests(cache: ComponentData[] | null): void {
  componentsCache = cache;
}

export const progressBoardRule: Rule = {
  name: "ProgressBoardTable",
  init,
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "ProgressBoardTable",
  transform: (node) => {
    if (!componentsCache || componentsCache.length === 0) return [node];
    return [{ type: "html", value: buildProgressBoardContent(componentsCache) }];
  },
};

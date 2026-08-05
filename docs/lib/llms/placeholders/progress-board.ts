import { createClient } from "@sanity/client";
import { escapeCell, markdownRow } from "../markdown-table";
import { type PlatformKey, PLATFORM_CONFIG, PLATFORM_STATUS_LABELS } from "@/lib/platform-status";
import { apiVersion, dataset, projectId } from "@/sanity-studio/env";
import { ALL_COMPONENTS_QUERY } from "@/sanity-studio/lib/queries";
import type { ComponentData, PlatformStatus } from "@/sanity-studio/lib/types";
import type { LLMPlaceholder } from "../types";

const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn: false });

function formatStatusCell(component: ComponentData, key: PlatformKey): string {
  const status = component[`${key}Status`] as PlatformStatus | undefined;
  const url = component[`${key}Url`] as string | undefined;
  const note = component[`${key}Note`] as string | undefined;

  const label = status ? PLATFORM_STATUS_LABELS[status] : undefined;
  if (!label) return "";

  const base = url ? `[${label}](${escapeCell(url)})` : label;
  return note ? `${base} (${escapeCell(note)})` : base;
}

function buildSummaryTable(components: ComponentData[]): string {
  const headers = ["Platform", "Progress", "Ready/Total"];
  const rows = PLATFORM_CONFIG.map(({ key, label }) => {
    const statusKey = `${key}Status` as keyof ComponentData;
    const planned = components.filter((component) => component[statusKey] !== "not-planned");
    const ready = planned.filter((component) => component[statusKey] === "ready").length;
    const percentage = planned.length === 0 ? 0 : Math.round((ready / planned.length) * 100);

    return markdownRow([label, `${percentage}%`, `${ready}/${planned.length}`]);
  });

  return [markdownRow(headers), markdownRow(headers.map(() => "---")), ...rows].join("\n");
}

function buildComponentTable(components: ComponentData[]): string {
  const headers = ["Component", ...PLATFORM_CONFIG.map(({ label }) => label)];
  const rows = components.map((component) =>
    markdownRow([
      escapeCell(component.name),
      ...PLATFORM_CONFIG.map(({ key }) => formatStatusCell(component, key)),
    ]),
  );

  return [markdownRow(headers), markdownRow(headers.map(() => "---")), ...rows].join("\n");
}

/** Fetched once per process; every page embedding the tag wants the same board. */
let components: Promise<ComponentData[]> | null = null;

async function loadComponents(): Promise<ComponentData[]> {
  try {
    return await sanityClient.fetch<ComponentData[]>(ALL_COMPONENTS_QUERY);
  } catch {
    return [];
  }
}

/**
 * `<ProgressBoardTable />` renders live Sanity data, so llms.txt cannot read it off the
 * page — it refetches. An empty result keeps the tag rather than emitting empty tables,
 * which would read as "nothing is implemented" instead of "the fetch failed".
 */
export const progressBoardPlaceholder: LLMPlaceholder = {
  names: ["ProgressBoardTable"],
  render: async () => {
    components ??= loadComponents();
    const data = await components;
    if (data.length === 0) return null;

    return [
      "### 플랫폼별 진행률",
      buildSummaryTable(data),
      "### 컴포넌트별 상태",
      buildComponentTable(data),
    ].join("\n\n");
  },
};

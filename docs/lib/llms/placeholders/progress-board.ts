import { escapeCell, markdownRow } from "../markdown-table";
import { type PlatformKey, PLATFORM_CONFIG, PLATFORM_STATUS_LABELS } from "@/lib/platform-status";
import type { ComponentData, PlatformStatus } from "@/sanity-studio/lib/types";
import { readSanityComponents } from "../sanity-components";
import type { LLMPlaceholder } from "../types";

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

/**
 * `<ProgressBoardTable />` renders live Sanity data, so the markdown cannot read it off the
 * page — it reads the copy taken before the build. An empty result keeps the tag rather
 * than emitting empty tables, which would read as "nothing is implemented".
 *
 * 컴포넌트 목록은 인자로 받는다. 테스트가 빌드 전에 받아 둔 Sanity 데이터에 묶이지 않게 하려는
 * 것이다.
 */
export function createProgressBoardPlaceholder(
  load: () => Promise<ComponentData[]>,
): LLMPlaceholder {
  // Read once per process; every page embedding the tag wants the same board.
  let components: Promise<ComponentData[]> | null = null;

  return {
    names: ["ProgressBoardTable"],
    render: async () => {
      components ??= load();
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
}

export const progressBoardPlaceholder = createProgressBoardPlaceholder(readSanityComponents);

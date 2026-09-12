import type { PlatformStatus } from "@/sanity-studio/lib/types";

/**
 * Platform column order + display labels, shared by the status/progress tables
 * (`components/platform-status-table`, `components/progress-board-table`) and the
 * llms markdown (`lib/llms/platform-status`, `lib/llms/placeholders/progress-board`).
 */
export const PLATFORM_CONFIG = [
  { key: "figma", label: "Figma" },
  { key: "react", label: "React" },
  { key: "lynx", label: "Lynx" },
  { key: "ios", label: "iOS" },
  { key: "android", label: "Android" },
] as const satisfies readonly { key: string; label: string }[];

export type PlatformKey = (typeof PLATFORM_CONFIG)[number]["key"];

/** Human labels for each rollout status. UI tone/variant stay local to each table. */
export const PLATFORM_STATUS_LABELS: Record<PlatformStatus, string> = {
  ready: "Done",
  "in-progress": "In Progress",
  "not-ready": "Not Ready",
  deprecated: "Deprecated",
  "not-planned": "Not Planned",
};

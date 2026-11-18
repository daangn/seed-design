import type { GeneratedRegistryItem } from "../registry/schema";

// CLI 레지스트리 산출물(`public/__registry__`, `bun docs:generate`가 만든다)을 render 중 fs로 읽지 않고 JSON module로
// import한다. module graph에 들어가야 Astro incremental build가 레지스트리 변경을 감지한다.
const items = import.meta.glob<GeneratedRegistryItem>("/public/__registry__/*/*/*.json", {
  eager: true,
  import: "default",
});

/** `public/__registry__/<id>.json`. 예: `react/ui/action-button`. 없으면 undefined. */
export function registryItem(id: string): GeneratedRegistryItem | undefined {
  return items[`/public/__registry__/${id}.json`];
}

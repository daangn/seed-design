import type { PlatformKey } from "./platform-status";
import type { PlatformStatus } from "../sanity-studio/lib/types";

/** Sanity 컴포넌트 문서의 도메인 모양. `scripts/prepare-sanity-snapshot.ts`가 만든다. */
export interface ComponentStatus {
  id: string;
  name: string;
  url?: string;
  platforms: Record<PlatformKey, { status: PlatformStatus; url?: string; note?: string }>;
}

/** 조회 시각을 넣지 않는다. 내용이 같으면 바이트가 같아야 incremental build가 문서를 복원한다. */
export interface ComponentStatusSnapshot {
  components: ComponentStatus[];
}

// render 중 네트워크·fs를 쓰지 않고 스냅숏을 module로 import한다. glob이라 파일이 없는 checkout에서도
// typecheck·테스트가 import 단계에서 깨지지 않는다(그때는 빈 목록).
const files = import.meta.glob<ComponentStatusSnapshot>("/.cache/build-data/sanity.json", {
  eager: true,
  import: "default",
});

/** 이름 순 전체 목록. 스냅숏이 없으면 빈 배열이다(`bun run prepare:sanity-snapshot`). */
export function allComponentStatuses(): ComponentStatus[] {
  return Object.values(files)[0]?.components ?? [];
}

export function componentStatus(id: string): ComponentStatus | undefined {
  return allComponentStatuses().find((component) => component.id === id);
}

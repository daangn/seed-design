import { Skeleton } from "@seed-design/react";

const SKELETON_ROWS = ["first", "second", "third", "fourth"] as const;

export function SearchLoading() {
  return (
    // biome-ignore lint/a11y/useSemanticElements: the search-state contract requires an explicit status role.
    <div
      className="flex flex-col gap-2 p-3"
      role="status"
      aria-busy={true}
      aria-label="검색 결과 불러오는 중"
    >
      {SKELETON_ROWS.map((row) => (
        <Skeleton key={row} tone="neutral" radius="8" width="full" height="x12" />
      ))}
    </div>
  );
}

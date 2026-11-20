import { Skeleton } from "@seed-design/react";

const SKELETON_ROWS = ["first", "second", "third", "fourth"] as const;

export function SearchLoading() {
  return (
    <div
      className="flex flex-col gap-2 p-3"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- the search-state contract requires an explicit status role.
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

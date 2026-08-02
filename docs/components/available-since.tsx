interface AvailableSinceProps {
  /** 콤마로 구분한 `패키지명@버전` 목록. 예: `"@seed-design/react@2.0.0, @seed-design/css@2.0.0"` */
  packages: string;
}

export function AvailableSince({ packages }: AvailableSinceProps) {
  const entries = packages
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (entries.length === 0) return null;

  return (
    <div className="not-prose my-6 flex flex-col items-end gap-0.5">
      <span className="text-[11px] font-extralight text-fg-neutral-subtle">사용 가능 버전</span>
      <span className="text-xs font-light text-fg-neutral">{entries.join(", ")}</span>
    </div>
  );
}

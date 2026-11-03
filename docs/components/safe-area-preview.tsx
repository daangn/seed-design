export interface PreviewSafeAreaInsets {
  left: number;
  right: number;
}

const hatch =
  "repeating-linear-gradient(135deg, color-mix(in srgb, var(--seed-color-fg-critical) 10%, transparent) 0 1px, transparent 1px 7px), color-mix(in srgb, var(--seed-color-fg-critical) 2%, transparent)";

export function getSafeAreaPreviewRules({ left, right }: PreviewSafeAreaInsets) {
  return [
    `.docs-safe-area-frame { position: relative; isolation: isolate; }`,
    `.docs-safe-area-frame::before, .docs-safe-area-frame::after { content: ""; position: absolute; top: 0; bottom: 0; z-index: 10; pointer-events: none; box-sizing: border-box; background: ${hatch}; }`,
    `.docs-safe-area-frame::before { left: 0; width: var(--docs-preview-safe-area-left, ${left}px); border-right: 1px dashed color-mix(in srgb, var(--seed-color-fg-critical) 35%, transparent); }`,
    `.docs-safe-area-frame::after { right: 0; width: var(--docs-preview-safe-area-right, ${right}px); border-left: 1px dashed color-mix(in srgb, var(--seed-color-fg-critical) 35%, transparent); }`,
  ];
}

export function SafeAreaPreviewLegend({ left, right }: PreviewSafeAreaInsets) {
  return (
    <div className="border-b border-solid border-stroke-neutral-muted px-4 py-3 text-sm text-fg-neutral-subtle">
      <p className="m-0">
        비교용 inset: 왼쪽 {left}px · 오른쪽 {right}px (가상)
      </p>
      <p className="m-0 mt-1 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-block h-4 w-6 shrink-0"
          style={{ background: hatch }}
        />
        붉은 빗금은 콘텐츠를 피해야 하는 inset 영역이며, 두 경계선 사이는 안전 영역입니다.
      </p>
    </div>
  );
}

import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

type ViewProps = IntrinsicElements["view"];
type LayoutChangeHandler = NonNullable<ViewProps["bindlayoutchange"]>;

export interface UseCollapsibleProps {
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @default false */
  disabled?: boolean;
}

export interface UseCollapsibleReturn {
  open: boolean;
  disabled: boolean;
  setOpen: (open: boolean) => void;
  /** disabled가 아니면 열림 상태를 뒤집습니다. */
  toggle: () => void;
  /**
   * 접히는 바깥 view에 펼칩니다. 열려 있으면 측정한 내용 높이, 측정 전이면 `auto`, 닫혀 있으면 `0px`이고
   * 닫힌 내용은 접근성 트리에서 숨깁니다.
   */
  contentProps: {
    style: { height: string; overflow: "hidden" };
    "accessibility-elements-hidden": boolean;
  };
  /** 내용 높이를 측정하는 안쪽 view에 펼칩니다. 이 view는 바깥 view의 높이에 줄어들지 않아야 합니다. */
  contentInnerProps: { bindlayoutchange: LayoutChangeHandler };
}

function getLayoutSize(
  event: Parameters<LayoutChangeHandler>[0],
  key: "width" | "height",
): number | null {
  const eventWithSize = event as Parameters<LayoutChangeHandler>[0] & {
    width?: number;
    height?: number;
  };
  const size = event.detail?.[key] ?? event.params?.[key] ?? eventWithSize[key];
  if (typeof size !== "number" || !Number.isFinite(size)) return null;
  return Math.max(0, size);
}

function getDevicePixel(): number {
  const pixelRatio = typeof SystemInfo === "undefined" ? undefined : SystemInfo.pixelRatio;
  return typeof pixelRatio === "number" && pixelRatio > 0 ? 1 / pixelRatio : 0;
}

/**
 * Android는 요소 가장자리를 기기 픽셀로 반올림해, 같은 내용도 위치의 소수 부분에 따라 1px 낮게 측정된다.
 * 이 값을 따르면 바깥 높이가 줄고 위치가 바뀌어 다시 1px 높게 측정되는 반복이 생기므로,
 * 1px 이내로 줄어든 측정은 버리고 큰 값을 유지한다.
 */
function nextContentHeight(current: number | null, measured: number): number | null {
  if (current === null || measured > current) return measured;
  return current - measured <= getDevicePixel() + 1e-3 ? current : measured;
}

/**
 * 열림 상태와 접히는 내용의 높이 측정을 제공하는 headless 훅입니다.
 * 닫힌 동안에도 안쪽 view가 측정되므로 처음 열 때 바로 내용 높이로 전환할 수 있습니다.
 */
export function useCollapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
}: UseCollapsibleProps = {}): UseCollapsibleReturn {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [contentHeight, setContentHeight] = React.useState<number | null>(null);

  const toggle = React.useCallback(() => {
    "background only";
    if (!disabled) setOpen(!open);
  }, [disabled, open, setOpen]);

  const handleLayoutChange = React.useCallback<LayoutChangeHandler>((event) => {
    "background only";
    const height = getLayoutSize(event, "height");
    if (height === null) return;
    // 조상이 `display: none`이면 0×0으로 보고된다. 이 값을 따르면 다시 보일 때 높이 0에서 펼쳐지므로
    // 마지막 높이를 유지한다. 빈 내용은 폭이 있어 그대로 반영된다.
    if (height === 0 && getLayoutSize(event, "width") === 0) return;

    setContentHeight((current) => nextContentHeight(current, height));
  }, []);

  const height = !open ? "0px" : contentHeight === null ? "auto" : `${contentHeight}px`;

  const contentProps = React.useMemo<UseCollapsibleReturn["contentProps"]>(
    () => ({
      style: { height, overflow: "hidden" },
      "accessibility-elements-hidden": !open,
    }),
    [height, open],
  );
  const contentInnerProps = React.useMemo(
    () => ({ bindlayoutchange: handleLayoutChange }),
    [handleLayoutChange],
  );

  return React.useMemo(
    () => ({ open, disabled, setOpen, toggle, contentProps, contentInnerProps }),
    [open, disabled, setOpen, toggle, contentProps, contentInnerProps],
  );
}

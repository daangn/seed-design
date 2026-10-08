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

function getLayoutHeight(event: Parameters<LayoutChangeHandler>[0]): number | null {
  const eventWithHeight = event as Parameters<LayoutChangeHandler>[0] & { height?: number };
  const height = event.detail?.height ?? event.params?.height ?? eventWithHeight.height;
  if (typeof height !== "number" || !Number.isFinite(height)) return null;
  return Math.max(0, height);
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
    const height = getLayoutHeight(event);
    if (height !== null) setContentHeight((current) => (current === height ? current : height));
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

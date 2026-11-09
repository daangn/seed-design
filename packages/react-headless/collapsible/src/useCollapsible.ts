import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import * as dom from "./dom";

export interface UseCollapsibleStateProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useCollapsibleState(props: UseCollapsibleStateProps) {
  const [open, setOpen] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
  });

  return useMemo(() => ({ open, setOpen }), [open, setOpen]);
}

export interface UseCollapsibleProps extends UseCollapsibleStateProps {
  disabled?: boolean;
}

export type UseCollapsibleReturn = ReturnType<typeof useCollapsible>;

export function useCollapsible(props: UseCollapsibleProps) {
  const { open, setOpen } = useCollapsibleState(props);
  const { disabled } = props;

  const id = useId();
  const contentId = dom.getContentId(id);

  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [visible, setVisible] = useState(open);

  const hidden = !open && !visible;

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const updateHeight = () => {
      if (!contentRef.current) return;
      // 조상이 `display: none`이면 높이가 0으로 측정된다. 그대로 쓰면 다시 보일 때 0에서 transition된다.
      // 닫힌 content는 스스로 `hidden`이라 늘 렌더되지 않는데, 이때 기록한 0이 다음에 열 때 transition의
      // 시작값이 된다. 건너뛰면 높이가 `auto`로 남아 열 때 transition 없이 펼쳐진다.
      if (open && contentRef.current.getClientRects().length === 0) return;

      setHeight(contentRef.current.scrollHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // When expanded, immediately show to allow transition
    setVisible(true);
  }, [open]);

  const panelHeight = open ? `${height}px` : "0px";

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-collapsible": "",
        "data-open": dataAttr(open),
        "data-disabled": dataAttr(disabled),
      }),
    [open, disabled],
  );

  return useMemo(
    () => ({
      open,
      setOpen,
      disabled,

      stateProps,

      triggerAriaProps: elementProps({
        "aria-expanded": open,
        "aria-controls": contentId,
        "aria-disabled": disabled,
      }),
      triggerHandlers: elementProps({
        onClick: (event) => {
          if (event.defaultPrevented) return;
          if (disabled) return;

          setOpen((prev) => !prev);
        },
      }),

      contentProps: elementProps({
        ...stateProps,
        id: contentId,
        hidden,
        style: {
          "--collapsible-content-height": height !== undefined ? panelHeight : undefined,
        } as React.CSSProperties,
        onTransitionEnd: (event) => {
          if (event.propertyName !== "height") return;
          if (open) return;

          setVisible(false);
        },
      }),

      refs: {
        content: contentRef,
      },
    }),
    [open, setOpen, disabled, stateProps, contentId, hidden, height, panelHeight],
  );
}

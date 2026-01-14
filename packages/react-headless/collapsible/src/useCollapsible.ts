import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
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
  const triggerId = dom.getTriggerId(id);
  const contentId = dom.getContentId(id);

  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [visible, setVisible] = useState(open);

  const hidden = !open && !visible;

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const updateHeight = () => {
      if (!contentRef.current) return;

      setHeight(contentRef.current.offsetHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;

    // When expanded, immediately show to allow transition
    setVisible(true);
  }, [open]);

  const toggle = useCallback(() => {
    if (disabled) return;

    setOpen((prev) => !prev);
  }, [disabled, setOpen]);

  const panelHeight = open ? `${height}px` : "0px";

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-open": dataAttr(open),
        "data-disabled": dataAttr(disabled),
      }),
    [open, disabled],
  );

  const triggerAriaProps = useMemo(
    () =>
      elementProps({
        "aria-expanded": open,
        "aria-controls": contentId,
        "aria-disabled": disabled,
      }),
    [open, contentId, disabled],
  );

  const triggerHandlers = useMemo(
    () => ({
      onClick: (event: React.MouseEvent) => {
        if (event.defaultPrevented) return;

        toggle();
      },
    }),
    [toggle],
  );

  return useMemo(
    () => ({
      open,
      setOpen,
      toggle,
      disabled,

      stateProps,

      triggerProps: elementProps({
        ...stateProps,
        id: triggerId,
      }),
      triggerAriaProps,
      triggerHandlers,

      contentProps: elementProps({
        ...stateProps,
        id: contentId,
        hidden,
        style: {
          "--collapsible-content-height": height !== undefined ? panelHeight : undefined,
        } as React.CSSProperties,
        onTransitionEnd: (event: React.TransitionEvent) => {
          if (event.propertyName !== "height") return;
          if (open) return;

          // When collapse transition ends, hide from screen readers and remove from tab order
          setVisible(false);
        },
      }),

      refs: {
        content: contentRef,
      },
    }),
    [
      open,
      setOpen,
      toggle,
      disabled,
      stateProps,
      triggerId,
      triggerAriaProps,
      triggerHandlers,
      contentId,
      hidden,
      height,
      panelHeight,
    ],
  );
}

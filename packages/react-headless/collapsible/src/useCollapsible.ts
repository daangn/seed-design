import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { dataAttr, elementProps } from "@ride-developer/dom-utils";
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

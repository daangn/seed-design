import {
  useClick,
  useDismiss,
  useHover,
  useInteractions,
  useRole,
  useTransitionStatus,
} from "@floating-ui/react";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useMemo } from "react";
import { usePositionedFloating, type UsePositionedFloatingProps } from "./floating";

export interface UsePopoverProps extends UsePositionedFloatingProps {
  /**
   * Whether to close the popover when clicking outside of it.
   * @default true
   */
  closeOnInteractOutside?: boolean;
  /**
   * How the popover opens. `"hover"` uses pointer enter/leave (touch included);
   * dismiss behavior (outside press, escape) still applies in both modes.
   * @default "click"
   */
  trigger?: "click" | "hover";
  /**
   * Delay in milliseconds before the popover opens on hover.
   * Only applies when `trigger` is `"hover"`.
   * @default 0
   */
  openDelay?: number;
  /**
   * Delay in milliseconds before the popover closes on hover leave.
   * Only applies when `trigger` is `"hover"`.
   * @default 0
   */
  closeDelay?: number;
  /**
   * ARIA role of the floating element, which also controls the aria
   * attributes emitted on the trigger.
   *
   * - `"dialog"`: trigger gets `aria-haspopup="dialog"` and `aria-expanded`;
   *   the floating element gets `role="dialog"`.
   * - `"tooltip"`: trigger gets `aria-describedby` while open; the floating
   *   element gets `role="tooltip"`. Per WAI-ARIA, tooltip content must not
   *   contain focusable children.
   *
   * @default "dialog"
   */
  role?: "dialog" | "tooltip";
}

export type UsePopoverReturn = ReturnType<typeof usePopover>;

export function usePopover({
  closeOnInteractOutside,
  trigger = "click",
  openDelay,
  closeDelay,
  role: roleProp,
  ...props
}: UsePopoverProps = {}) {
  const {
    open,
    onOpenChange,
    refs,
    isPositioned,
    side,
    alignment,
    context,
    floatingStyles,
    arrowStyles,
    rects,
  } = usePositionedFloating(props);

  const role = useRole(context, { role: roleProp ?? "dialog" });
  const click = useClick(context, { enabled: trigger === "click" });
  const hover = useHover(context, {
    enabled: trigger === "hover",
    delay: { open: openDelay, close: closeDelay },
  });
  const dismiss = useDismiss(context, {
    outsidePress: closeOnInteractOutside ?? true,
  });

  const { status } = useTransitionStatus(context);
  const triggerInteractions = useInteractions([role, click, hover, dismiss]);
  const anchorInteractions = useInteractions([role, dismiss]);

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-side": side,
        "data-alignment": alignment,
        "data-hidden": dataAttr(status === "unmounted"),
        "data-positioned": dataAttr(isPositioned),
        "data-open": dataAttr(status === "open" || status === "initial"),
      }),
    [side, alignment, isPositioned, status],
  );

  return useMemo(
    () => ({
      open,
      refs: {
        anchor: refs.setReference as (instance: HTMLElement | null) => void,
        trigger: refs.setReference as (instance: HTMLElement | null) => void,
        positioner: refs.setFloating as (instance: HTMLElement | null) => void,
        arrow: refs.setArrow as (instance: HTMLElement | null) => void,
        arrowTip: refs.setArrowTip as (instance: SVGSVGElement | null) => void,
      },
      rects,
      stateProps,
      anchorProps: elementProps({ ...anchorInteractions.getReferenceProps(), ...stateProps }),
      triggerProps: elementProps({
        ...triggerInteractions.getReferenceProps(),
        ...stateProps,
      }),
      positionerProps: elementProps({
        ...triggerInteractions.getFloatingProps(),
        ...stateProps,
        style: floatingStyles,
      }),
      arrowProps: elementProps({
        ...stateProps,
        style: arrowStyles,
      }),
      closeButtonProps: buttonProps({
        ...stateProps,
        onClick: (e) => {
          if (e.defaultPrevented) return;

          onOpenChange?.(false);
        },
      }),
    }),
    [
      open,
      onOpenChange,
      refs,
      stateProps,
      triggerInteractions,
      anchorInteractions,
      floatingStyles,
      arrowStyles,
      rects,
    ],
  );
}

import {
  useDismiss,
  useFocus,
  useHover,
  useInteractions,
  useNextDelayGroup,
  useRole,
  useTransitionStatus,
} from "@floating-ui/react";
import {
  usePositionedFloating,
  type UsePositionedFloatingProps,
} from "@seed-design/react-floating";
import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useMemo } from "react";

/** Default open delay (ms), shared with `TooltipDelayGroup`. */
export const DEFAULT_OPEN_DELAY = 200;
/** Default close delay (ms), shared with `TooltipDelayGroup`. */
export const DEFAULT_CLOSE_DELAY = 100;

export interface UseTooltipProps extends UsePositionedFloatingProps {
  /**
   * Delay in milliseconds before the tooltip opens on hover.
   * @default 200
   */
  openDelay?: number;
  /**
   * Delay in milliseconds before the tooltip closes after the pointer leaves.
   * @default 100
   */
  closeDelay?: number;
  /**
   * Whether the tooltip stays open while the pointer is over its content.
   * @default false
   */
  keepOpenOnContentHover?: boolean;
}

export type UseTooltipReturn = ReturnType<typeof useTooltip>;

export function useTooltip({
  openDelay,
  closeDelay,
  keepOpenOnContentHover,
  ...props
}: UseTooltipProps = {}) {
  const { open, refs, isPositioned, side, alignment, context, floatingStyles, arrowStyles, rects } =
    usePositionedFloating(props);

  const role = useRole(context, { role: "tooltip" });
  const group = useNextDelayGroup(context);
  // Defer to the group's delay only when inside one and no per-trigger override
  // is set; a custom open/close delay always wins.
  const useGroupDelay = group.hasProvider && openDelay === undefined && closeDelay === undefined;
  const hover = useHover(context, {
    delay: useGroupDelay
      ? () => group.delayRef.current
      : { open: openDelay ?? DEFAULT_OPEN_DELAY, close: closeDelay ?? DEFAULT_CLOSE_DELAY },
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);

  const { status } = useTransitionStatus(context);
  const triggerInteractions = useInteractions([role, hover, focus, dismiss]);

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-side": side,
        "data-alignment": alignment,
        "data-hidden": dataAttr(status === "unmounted"),
        "data-positioned": dataAttr(isPositioned),
        "data-open": dataAttr(status === "open" || status === "initial"),
        // While switching between tooltips in a `TooltipDelayGroup`, skip the
        // enter/exit animation so the swap reads as instant (see recipe).
        "data-instant": dataAttr(group.isInstantPhase),
      }),
    [side, alignment, isPositioned, status, group.isInstantPhase],
  );

  return useMemo(
    () => ({
      open,
      refs: {
        trigger: refs.setReference as (instance: HTMLElement | null) => void,
        positioner: refs.setFloating as (instance: HTMLElement | null) => void,
        arrow: refs.setArrow as (instance: HTMLElement | null) => void,
        arrowTip: refs.setArrowTip as (instance: SVGSVGElement | null) => void,
      },
      rects,
      stateProps,
      triggerProps: elementProps({
        ...triggerInteractions.getReferenceProps(),
        ...stateProps,
      }),
      positionerProps: elementProps({
        ...triggerInteractions.getFloatingProps(),
        ...stateProps,
        // block pointer events so hovering the content can't keep the tooltip open
        style: keepOpenOnContentHover
          ? floatingStyles
          : { ...floatingStyles, pointerEvents: "none" },
      }),
      arrowProps: elementProps({
        ...stateProps,
        style: arrowStyles,
      }),
    }),
    [
      open,
      refs,
      stateProps,
      triggerInteractions,
      floatingStyles,
      arrowStyles,
      rects,
      keepOpenOnContentHover,
    ],
  );
}

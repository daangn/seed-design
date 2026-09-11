import { useClick, useInteractions, useRole, useTransitionStatus } from "@floating-ui/react";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useMemo } from "react";
import {
  usePositionedFloating,
  type UsePositionedFloatingProps,
} from "@seed-design/react-floating";

// TODO: useRole이 임의로 id를 생성하는 문제가 있음. 동작만 참고하고 role="dialog"에 맞게 aria attribute 설정을 직접 해야 함.

export interface UsePopoverProps extends UsePositionedFloatingProps {
  /**
   * Whether to close the popover when clicking outside of it.
   * @default true
   */
  closeOnInteractOutside?: boolean;
}

export type UsePopoverReturn = ReturnType<typeof usePopover>;

export function usePopover({ closeOnInteractOutside = true, ...props }: UsePopoverProps = {}) {
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

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  // Deliberately absent: floating-ui's `useDismiss`. Dismissal is the layer stack's job (see
  // `PopoverDismissibleLayer` in Popover.tsx); running both would close the popover twice and
  // bind an Escape handler that ignores which layer is on top.
  const role = useRole(context);
  const click = useClick(context);

  const { status } = useTransitionStatus(context);
  const triggerInteractions = useInteractions([role, click]);
  const anchorInteractions = useInteractions([role]);

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
      setOpen,
      // Handed back rather than consumed here: the outside-press listener lives on the
      // positioner's DismissibleLayer, which is the element that decides what "outside" is.
      closeOnInteractOutside,
      floatingContext: context,
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
        "aria-haspopup": "dialog",
        "aria-expanded": open,
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

          setOpen(false);
        },
      }),
    }),
    [
      open,
      setOpen,
      closeOnInteractOutside,
      context,
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

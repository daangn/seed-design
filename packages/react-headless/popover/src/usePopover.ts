import {
  useClick,
  useDismiss,
  useInteractions,
  useRole,
  useTransitionStatus,
} from "@floating-ui/react";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useMemo } from "react";
import { usePositionedFloating, type UsePositionedFloatingProps } from "./floating";

// TODO: useRole이 임의로 id를 생성하는 문제가 있음. 동작만 참고하고 role="dialog"에 맞게 aria attribute 설정을 직접 해야 함.

export interface UsePopoverProps extends UsePositionedFloatingProps {}

export type UsePopoverReturn = ReturnType<typeof usePopover>;

export function usePopover(props: UsePopoverProps = {}) {
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

  const role = useRole(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { status } = useTransitionStatus(context);
  const triggerInteractions = useInteractions([role, click, dismiss]);
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
          onOpenChange(false);
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

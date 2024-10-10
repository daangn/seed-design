import { useClick, useDismiss, useInteractions, useRole } from "@floating-ui/react";
import { usePositionedFloating, type UsePositionedFloatingProps } from "./floating.js";

// TODO: useRole이 임의로 id를 생성하는 문제가 있음. 동작만 참고하고 role="dialog"에 맞게 aria attribute 설정을 직접 해야 함.

export interface UsePopoverProps extends UsePositionedFloatingProps {}

export function usePopover(props: UsePopoverProps = {}) {
  const { open, refs, context, floatingStyles, arrowStyles, rects } = usePositionedFloating(props);

  const role = useRole(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);

  const triggerInteractions = useInteractions([role, click, dismiss]);
  const anchorInteractions = useInteractions([role, dismiss]);

  return {
    open,
    refs: {
      anchor: refs.setReference as (instance: HTMLElement | null) => void,
      trigger: refs.setReference as (instance: HTMLElement | null) => void,
      positioner: refs.setFloating as (instance: HTMLElement | null) => void,
      arrow: refs.setArrow as (instance: HTMLElement | null) => void,
    },
    rects,
    anchorProps: {
      ...anchorInteractions.getReferenceProps(),
    },
    triggerProps: {
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      ...triggerInteractions.getReferenceProps(),
    } as const,
    positionerProps: {
      ...triggerInteractions.getFloatingProps(),
      style: floatingStyles,
    },
    arrowProps: {
      style: arrowStyles,
    },
  };
}

import {
  useClick,
  useDismiss,
  useInteractions,
  useRole,
  useTransitionStatus,
} from "@floating-ui/react";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useId, useMemo, useState } from "react";
import {
  usePositionedFloating,
  type UsePositionedFloatingProps,
} from "@seed-design/react-floating";
import { getDescriptionId, getTitleId } from "./dom";

export interface UsePopoverProps extends UsePositionedFloatingProps {
  /**
   * Whether to close the popover when clicking outside of it.
   * @default true
   */
  closeOnInteractOutside?: boolean;
}

export type UsePopoverReturn = ReturnType<typeof usePopover>;

export function usePopover({ closeOnInteractOutside, ...props }: UsePopoverProps = {}) {
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

  const id = useId();

  // Presence-aware aria wiring: the content (dialog) only references a title/description id
  // when that part is actually rendered, mirroring `useField`. Tracking lives here in the
  // hook (not a styled context) so aria is guaranteed at the headless layer, and a title-less
  // popover never emits a dangling `aria-labelledby` that would clobber a user `aria-label`.
  const [isTitleRendered, setIsTitleRendered] = useState(false);
  const titleRef = useCallback((node: HTMLElement | null) => {
    setIsTitleRendered(!!node);
  }, []);
  const [isDescriptionRendered, setIsDescriptionRendered] = useState(false);
  const descriptionRef = useCallback((node: HTMLElement | null) => {
    setIsDescriptionRendered(!!node);
  }, []);

  const role = useRole(context);
  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePress: closeOnInteractOutside ?? true,
  });

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
        arrowTip: refs.setArrowTip as (instance: SVGSVGElement | null) => void,
        title: titleRef,
        description: descriptionRef,
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
        ...stateProps,
        style: floatingStyles,
      }),
      contentProps: elementProps({
        ...triggerInteractions.getFloatingProps(),
        ...stateProps,
        ...(isTitleRendered && { "aria-labelledby": getTitleId(id) }),
        ...(isDescriptionRendered && { "aria-describedby": getDescriptionId(id) }),
      }),
      titleProps: elementProps({
        id: getTitleId(id),
        ...stateProps,
      }),
      descriptionProps: elementProps({
        id: getDescriptionId(id),
        ...stateProps,
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
      id,
      isTitleRendered,
      isDescriptionRendered,
      titleRef,
      descriptionRef,
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

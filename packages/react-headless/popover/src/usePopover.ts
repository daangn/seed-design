import {
  useClick,
  useInteractions,
  useRole,
  useTransitionStatus,
  type OpenChangeReason,
  type ReferenceType,
} from "@floating-ui/react";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useId, useMemo, useState } from "react";
import {
  usePositionedFloating,
  type UsePositionedFloatingProps,
} from "@seed-design/react-floating";
import { getDescriptionId, getTitleId } from "./dom";

interface PopoverReasonToDetailMap {
  /** The trigger toggled the popover — a click on it, or a key that activates it. */
  trigger: { event: MouseEvent | KeyboardEvent };
  closeButton: { event: MouseEvent };
  escapeKeyDown: { event: KeyboardEvent };
  interactOutside: { event: PointerEvent | TouchEvent };
  /** A parent layer unmounted and cascade-dismissed this one. */
  cascadeDismiss: { dismissedParent: HTMLElement };
}

type PopoverChangeDetails = {
  [R in keyof PopoverReasonToDetailMap]: {
    reason?: R;
  } & PopoverReasonToDetailMap[R];
}[keyof PopoverReasonToDetailMap];

// The trigger's `useClick` is the only open-state change floating-ui drives on its own;
// everything else runs through `setOpen` below or the layer callbacks in Popover.tsx.
// floating-ui reports it as "click" and hands over the click/mousedown/keydown that drove it.
function getFloatingChangeDetails(
  event: Event | undefined,
  reason: OpenChangeReason | undefined,
): PopoverChangeDetails | undefined {
  if (reason !== "click") return undefined;
  if (!(event instanceof MouseEvent) && !(event instanceof KeyboardEvent)) return undefined;

  return { reason: "trigger", event };
}

export interface UsePopoverProps extends UsePositionedFloatingProps<PopoverChangeDetails> {
  /**
   * Whether to close the popover when clicking outside of it.
   * @default true
   */
  closeOnInteractOutside?: boolean;

  /**
   * Whether to enable lazy mounting
   * @default false
   */
  lazyMount?: boolean;

  /**
   * Whether to unmount on exit.
   * @default false
   */
  unmountOnExit?: boolean;
}

export type UsePopoverReturn = ReturnType<typeof usePopover>;

export function usePopover({
  closeOnInteractOutside = true,
  lazyMount = false,
  unmountOnExit = false,
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
  } = usePositionedFloating<ReferenceType, PopoverChangeDetails>(props, getFloatingChangeDetails);

  // The single write path for open state, so every caller — the close button here and the
  // layer-stack callbacks in Popover.tsx — funnels through one place.
  const setOpen = useCallback(
    (nextOpen: boolean, details?: PopoverChangeDetails) => {
      onOpenChange(nextOpen, details);
    },
    [onOpenChange],
  );

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

  // Deliberately absent: floating-ui's `useDismiss`. Dismissal is the layer stack's job
  // (see `PopoverDismissibleLayer` in Popover.tsx) — running both would close the popover
  // twice and bind an Escape handler that ignores which layer is on top.
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
      // Presence gating stops at the content: the positioner has to stay mounted while closed
      // so floating-ui keeps a real node to measure and reposition against.
      lazyMount,
      unmountOnExit,
      floatingContext: context,
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

          setOpen(false, { reason: "closeButton", event: e.nativeEvent });
        },
      }),
    }),
    [
      open,
      setOpen,
      closeOnInteractOutside,
      lazyMount,
      unmountOnExit,
      context,
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

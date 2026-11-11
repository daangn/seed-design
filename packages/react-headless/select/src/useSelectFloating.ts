import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  useTransitionStatus,
  type MiddlewareState,
  type OpenChangeReason,
  type Placement,
} from "@floating-ui/react";
import {
  observeSafeAreaInsets,
  readSafeAreaInsets,
  safeAreaInsetStyle,
} from "@seed-design/dom-utils";
import { useCallback, useEffect, useRef } from "react";
import type * as React from "react";
import type { SelectOpenChangeDetails } from "./useSelect";

const MIN_HEIGHT = 200;

function getTransformOrigin(placement: string) {
  const [side, align] = placement.split("-");
  const facing =
    { top: "bottom", bottom: "top", left: "right", right: "left" }[side ?? ""] ?? "top";
  if (side === "left" || side === "right") {
    const y = { start: "top", end: "bottom" }[align ?? ""] ?? "center";
    return `${facing} ${y}`;
  }

  const x = { start: "left", end: "right" }[align ?? ""] ?? "center";
  return `${x} ${facing}`;
}

export interface UseSelectPositioningProps {
  /**
   * Floating UI placement.
   * @default "bottom"
   */
  placement?: Placement;

  /**
   * Distance between the trigger and the listbox.
   * @default 8
   */
  gutter?: number;

  /**
   * Virtual padding around viewport edges for collision detection. On an edge with a
   * safe-area inset, it is added to the inset.
   * @default 8
   */
  overflowPadding?: number;

  /**
   * Positioning strategy.
   * @default "absolute"
   */
  strategy?: "absolute" | "fixed";
}

export interface UseSelectFloatingProps extends UseSelectPositioningProps {
  open: boolean;
  setOpen: (open: boolean, details?: SelectOpenChangeDetails) => void;
}

// Anchors the listbox to the trigger and keeps it inside the viewport: placement,
// collision handling, the CSS custom properties the styled layer sizes itself
// with, and the mount/unmount transition status.
export function useSelectFloating(props: UseSelectFloatingProps) {
  const {
    open,
    setOpen,
    placement = "bottom",
    gutter = 8,
    overflowPadding = 8,
    strategy = "absolute",
  } = props;

  // flip/size/shift derive collisions from numeric padding, so the safe-area insets
  // have to reach floating-ui as numbers — a CSS env() value alone can't. Inset the
  // viewport collision boundary so they keep the listbox clear of the notch, home
  // indicator and side insets, not just the viewport edge.
  // overflowPadding is measured from the safe area's boundary, so it keeps the same gap
  // from what's visible whether or not an edge has an inset.
  // positioner는 `safeAreaInsetStyle`로 inset을 다시 선언해요. host는 resize 없이 inset을
  // 바꿀 수 있어서, 위치를 계산할 때마다 그 값을 새로 읽어요.
  const collisionPadding = ({ elements }: MiddlewareState) => {
    const insets = readSafeAreaInsets(elements.floating);

    return {
      top: insets.top + overflowPadding,
      right: insets.right + overflowPadding,
      bottom: insets.bottom + overflowPadding,
      left: insets.left + overflowPadding,
    };
  };

  // Every other open/close runs through our own handlers; the one state change
  // floating-ui drives on its own is FloatingFocusManager's closeOnFocusOut.
  const focusOutTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(focusOutTimeout.current), [open]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean, event?: Event, reason?: OpenChangeReason) => {
      if (reason === "focus-out" && event instanceof FocusEvent) {
        // Removing portal guards between native focusout and focusin lets an ancestor
        // Radix FocusScope's mutation observer steal focus while activeElement is body.
        // https://github.com/radix-ui/primitives/issues/2436
        clearTimeout(focusOutTimeout.current);
        focusOutTimeout.current = setTimeout(
          () => setOpen(nextOpen, { reason: "focusOut", event }),
          0,
        );

        return;
      }

      setOpen(nextOpen);
    },
    [setOpen],
  );

  const {
    refs: floatingRefs,
    context,
    floatingStyles,
  } = useFloating({
    open,
    onOpenChange: handleOpenChange,
    strategy,
    placement,
    middleware: [
      offset(gutter),
      flip((state) => ({
        padding: collisionPadding(state),
        fallbackStrategy: "initialPlacement",
      })),
      shift((state) => ({ padding: collisionPadding(state) })),
      size((state) => ({
        padding: collisionPadding(state),
        apply({ availableHeight, rects, elements }) {
          elements.floating.style.setProperty(
            "--seed-select-available-height",
            `${Math.max(MIN_HEIGHT, availableHeight)}px`,
          );
          elements.floating.style.setProperty(
            "--seed-select-reference-width",
            `${rects.reference.width}px`,
          );
        },
      })),
    ],
  });

  // The reference may be a floating-ui virtual element; only a real element
  // can receive focus redirects.
  const getTriggerElement = useCallback(() => {
    const reference = floatingRefs.reference.current;
    return reference instanceof HTMLElement ? reference : null;
  }, [floatingRefs.reference]);

  const { status } = useTransitionStatus(context);

  // Keep autoUpdate alive during the exit animation so the positioner follows
  // the trigger even while the listbox is animating out.
  const mounted = status !== "unmounted";

  // Key the autoUpdate effect on the reactive `elements`, not `refs.*`: the ref objects'
  // identity never changes, so an effect depending on them runs only once at mount —
  // before FloatingPortal has committed the positioner child — reads a null ref, bails,
  // and never re-fires. `elements` updates when each element attaches (the positioner
  // stays mounted even while closed), so the effect runs against real nodes.
  const referenceElement = context.elements.reference;
  const floatingElement = context.elements.floating;

  // `context.update` rather than `context`: floating-ui rebuilds the context object on
  // every position commit, so depending on it tears autoUpdate's scroll listeners and
  // observers down and rebuilds them on every scroll frame. `update` is stable.
  const { update } = context;

  useEffect(() => {
    if (!mounted) return;
    if (!referenceElement || !floatingElement) return;

    return autoUpdate(referenceElement, floatingElement, update);
  }, [mounted, referenceElement, floatingElement, update]);

  useEffect(() => {
    if (!mounted) return;

    return observeSafeAreaInsets(update);
  }, [mounted, update]);

  return {
    context,
    status,
    transformOrigin: getTransformOrigin(context.placement),
    positionerStyle: { ...safeAreaInsetStyle, ...floatingStyles } as React.CSSProperties,

    refs: {
      trigger: (node: HTMLElement | null) => floatingRefs.setReference(node),
      positioner: (node: HTMLElement | null) => floatingRefs.setFloating(node),
      getTriggerElement,
    },
  };
}

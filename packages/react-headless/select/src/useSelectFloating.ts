import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  useTransitionStatus,
  type Placement,
} from "@floating-ui/react";
import { useCallback, useEffect, useState } from "react";
import type * as React from "react";

const MIN_HEIGHT = 200;

// flip/size/shift derive collisions from numeric padding, so the safe-area insets
// have to reach floating-ui as numbers — a CSS env() value alone can't. The
// positioner re-declares the insets from env() here and the hook reads them back
// as px (see the effect after useFloating), which keeps this layer self-contained
// from the global SEED safe-area tokens.
const SAFE_AREA_STYLE = {
  "--seed-safe-area-top": "env(safe-area-inset-top)",
  "--seed-safe-area-bottom": "env(safe-area-inset-bottom)",
} as React.CSSProperties;

function getTransformOrigin(placement: string) {
  const [side, align] = placement.split("-");
  const x = { start: "left", end: "right" }[align ?? ""] ?? "center";
  const y = { top: "bottom", bottom: "top", left: "center", right: "center" }[side ?? ""] ?? "top";
  return `${x} ${y}`;
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
   * Virtual padding around viewport edges for collision detection.
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
  setOpen: (open: boolean) => void;
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

  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });

  // Inset the viewport collision boundary so flip/size/shift keep the listbox clear
  // of the notch and home indicator, not just the viewport edge. The safe area is
  // already a visual buffer, so where it exists the listbox sits right at its
  // boundary; only where there is none does it fall back to overflowPadding.
  const collisionPadding = {
    top: safeArea.top || overflowPadding,
    right: overflowPadding,
    bottom: safeArea.bottom || overflowPadding,
    left: overflowPadding,
  };

  const {
    refs: floatingRefs,
    context,
    floatingStyles,
  } = useFloating({
    open,
    onOpenChange: setOpen,
    strategy,
    placement,
    middleware: [
      offset(gutter),
      flip({ padding: collisionPadding, fallbackStrategy: "initialPlacement" }),
      shift({ padding: collisionPadding }),
      size({
        padding: collisionPadding,
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
      }),
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

  // Key the effects below on the reactive `elements`, not `refs.*`: the ref objects'
  // identity never changes, so an effect depending on them runs only once at mount —
  // before FloatingPortal has committed the positioner child — reads a null ref, bails,
  // and never re-fires. `elements` updates when each element attaches (the positioner
  // stays mounted even while closed), so both effects run against real nodes.
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

  // Read the env()-resolved insets off the positioner, which carries the env()
  // declarations via SAFE_AREA_STYLE. Re-read on resize for orientation changes.
  useEffect(() => {
    if (!floatingElement) return;

    const read = () => {
      const styles = getComputedStyle(floatingElement);
      setSafeArea({
        top: Number.parseInt(styles.getPropertyValue("--seed-safe-area-top"), 10) || 0,
        bottom: Number.parseInt(styles.getPropertyValue("--seed-safe-area-bottom"), 10) || 0,
      });
    };

    read();
    window.addEventListener("resize", read);

    return () => window.removeEventListener("resize", read);
  }, [floatingElement]);

  return {
    context,
    status,
    transformOrigin: getTransformOrigin(context.placement),
    positionerStyle: { ...SAFE_AREA_STYLE, ...floatingStyles } as React.CSSProperties,

    refs: {
      trigger: (node: HTMLElement | null) => floatingRefs.setReference(node),
      positioner: (node: HTMLElement | null) => floatingRefs.setFloating(node),
      getTriggerElement,
    },
  };
}

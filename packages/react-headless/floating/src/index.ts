import {
  arrow,
  autoUpdate,
  flip,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
  useTransitionStatus,
  type Alignment,
  type ExtendedRefs,
  type FloatingContext,
  type Middleware,
  type OpenChangeReason,
  type Padding,
  type Placement,
  type Rect,
  type ReferenceType,
  type Side,
} from "@floating-ui/react";
import { useControllableState } from "@seed-design/react-use-controllable-state";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";

export interface PositioningOptions {
  /**
   * The strategy to use for positioning
   * @default "absolute"
   */
  strategy?: "absolute" | "fixed";
  /**
   * The initial placement of the floating element
   * @default "bottom"
   */
  placement?: Placement;
  /**
   * The gutter between the floating element and the reference element
   */
  gutter?: number;
  /**
   * Whether to flip the placement
   * @default true
   */
  flip?: boolean | Placement[];
  /**
   * Whether the popover should slide when it overflows.
   * @default true
   */
  slide?: boolean;
  /**
   * The virtual padding around the viewport edges to check for overflow
   * @default 8
   */
  overflowPadding?: number;
  /**
   * The minimum padding between the arrow and the floating element's corner.
   * @default 4
   */
  arrowPadding?: number;
  /**
   * Whether flip/shift/size should treat the device safe-area insets as part of the
   * viewport collision boundary, so the floating element stays clear of the notch and
   * home indicator instead of only the bare viewport edge.
   *
   * Off by default so existing consumers (HelpBubble, Tooltip) keep their placement; a
   * container popover that fills the viewport height opts in.
   * @default false
   */
  safeAreaAware?: boolean;
}

const defaultPositioningOptions: PositioningOptions = {
  strategy: "absolute",
  placement: "bottom",
  flip: true,
  slide: true,
  overflowPadding: 8,
  arrowPadding: 4,
  safeAreaAware: false,
};

// flip/size/shift derive collisions from numeric padding, so the safe-area insets have to
// reach floating-ui as numbers — a CSS env() value alone can't. Like Menu's useMenu and
// Snackbar's useSafeOffset, the positioner re-declares the insets from env() here and the
// hook reads them back as px (see the effect after useFloating), which keeps this layer
// self-contained from the global SEED safe-area tokens.
const SAFE_AREA_STYLE = {
  "--seed-safe-area-top": "env(safe-area-inset-top)",
  "--seed-safe-area-bottom": "env(safe-area-inset-bottom)",
} as CSSProperties;

function getArrowMiddleware(arrowElement: HTMLElement | null, opts: PositioningOptions) {
  if (!arrowElement) return;
  return arrow({ element: arrowElement, padding: opts.arrowPadding });
}

function getOffsetMiddleware(arrowOffset: number, opts: PositioningOptions) {
  const offsetMainAxis = (opts.gutter ?? 0) + arrowOffset;
  return offset(offsetMainAxis);
}

function getFlipMiddleware(opts: PositioningOptions, collisionPadding: Padding) {
  if (!opts.flip) return;
  return flip({
    padding: collisionPadding,
    fallbackPlacements: opts.flip === true ? undefined : opts.flip,
  });
}

function getShiftMiddleware(opts: PositioningOptions, collisionPadding: Padding) {
  if (!opts.slide) return;
  return shift({
    mainAxis: opts.slide,
    padding: collisionPadding,
    limiter: limitShift(),
  });
}

function getSizeMiddleware(collisionPadding: Padding) {
  return size({
    padding: collisionPadding,
    apply({ availableWidth, availableHeight, elements }) {
      elements.floating.style.setProperty(
        "--seed-popover-available-width",
        `${Math.max(0, availableWidth)}px`,
      );
      elements.floating.style.setProperty(
        "--seed-popover-available-height",
        `${Math.max(0, availableHeight)}px`,
      );
    },
  });
}

const rectMiddleware: Middleware = {
  name: "rects",
  fn({ rects }) {
    return {
      data: rects,
    };
  },
};

export interface UsePositionedFloatingProps<Details = undefined> extends PositioningOptions {
  /**
   * Whether the floating element is initially open
   */
  defaultOpen?: boolean;
  /**
   * Whether the floating element is open
   */
  open?: boolean;
  /**
   * Callback when the floating element is opened or closed. `details` is whatever the
   * caller's `getChangeDetails` produced, or whatever it passed to the returned
   * `onOpenChange`; a floating element that reports no reason leaves it undefined.
   */
  onOpenChange?: (open: boolean, details?: Details) => void;
}

const ARROW_FLOATING_STYLE = {
  top: "",
  right: "rotate(90deg)",
  bottom: "rotate(180deg)",
  left: "rotate(270deg)",
} as const;

// Explicit return type interface - leveraging @floating-ui/react types
export interface UsePositionedFloatingReturn<
  RT extends ReferenceType = ReferenceType,
  Details = undefined,
> {
  open: boolean;
  onOpenChange: (open: boolean, details?: Details) => void;
  refs: ExtendedRefs<RT> & {
    arrow: HTMLElement | null;
    setArrow: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    arrowTip: HTMLElement | null;
    setArrowTip: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  };
  rects: {
    reference: Rect;
    floating: Rect;
    arrowTip: { width: number; height: number };
  };
  isPositioned: boolean;
  side: Side;
  alignment: Alignment | undefined;
  context: FloatingContext<RT>;
  floatingStyles: CSSProperties;
  arrowStyles: CSSProperties;
}

export function usePositionedFloating<
  RT extends ReferenceType = ReferenceType,
  Details = undefined,
>(
  props: UsePositionedFloatingProps<Details>,
  /**
   * Translates the open-state changes floating-ui drives on its own — `useClick`,
   * `useHover`, `useFocus`, `useDismiss` — into the caller's details shape. floating-ui
   * reports them as `(open, event, reason)`, so a caller that wants the originating event
   * has to name it here; without a mapper those two arguments have nowhere to go.
   */
  getChangeDetails?: (
    event: Event | undefined,
    reason: OpenChangeReason | undefined,
  ) => Details | undefined,
): UsePositionedFloatingReturn<RT, Details> {
  const options = { ...defaultPositioningOptions, ...props };
  const { safeAreaAware = false, overflowPadding = 8 } = options;

  const [open, onOpenChange] = useControllableState<boolean, Details>({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
  });

  // Never hand `onOpenChange` to `useFloating` directly: floating-ui calls it as
  // `(open, event, reason)`, so the event would land in the setter's `details` slot and
  // reach the consumer's callback disguised as a reason payload.
  const handleFloatingOpenChange = useCallback(
    (nextOpen: boolean, event?: Event, reason?: OpenChangeReason) => {
      onOpenChange(nextOpen, getChangeDetails?.(event, reason));
    },
    [onOpenChange, getChangeDetails],
  );

  const [arrowEl, setArrowEl] = useState<HTMLElement | null>(null);
  const [arrowTipEl, setArrowTipEl] = useState<HTMLElement | null>(null);
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });

  const arrowTipWidth = arrowTipEl?.clientWidth ?? 0;
  const arrowTipHeight = arrowTipEl?.clientHeight ?? 0;
  const arrowTipOffset = arrowTipHeight;

  // Inset the viewport collision boundary by the safe area so flip/shift/size keep the
  // floating element clear of the notch and home indicator, not just the bare viewport edge.
  // Where a safe area exists the element sits right at its boundary; where there is none it
  // falls back to overflowPadding. Only active when safeAreaAware — otherwise a plain scalar.
  const collisionPadding: Padding = safeAreaAware
    ? {
        top: safeArea.top || overflowPadding,
        right: overflowPadding,
        bottom: safeArea.bottom || overflowPadding,
        left: overflowPadding,
      }
    : overflowPadding;

  const { refs, context, floatingStyles, middlewareData, isPositioned } = useFloating<RT>({
    strategy: options.strategy,
    open,
    placement: options.placement,
    onOpenChange: handleFloatingOpenChange,
    middleware: [
      getOffsetMiddleware(arrowTipOffset, options),
      getFlipMiddleware(options, collisionPadding),
      getShiftMiddleware(options, collisionPadding),
      getSizeMiddleware(collisionPadding),
      getArrowMiddleware(arrowEl, options),
      rectMiddleware,
    ],
    // instead of defining `whileElementsMounted` here, we use an effect below
  });

  const { status } = useTransitionStatus(context);

  // Gate anchoring on the transition rather than on `open`, so autoUpdate outlives the close
  // and the floating element keeps following the reference while it animates out.
  const mounted = status !== "unmounted";

  // Key the effects below on the reactive `context.elements`, not `refs.*`: the ref objects'
  // identity never changes, so an effect on them would run once before the positioner mounts,
  // read null, bail, and never re-fire. `elements` updates as each element attaches.
  const referenceElement = context.elements.reference;
  const floatingElement = context.elements.floating;

  // `context.update` rather than `context`: floating-ui rebuilds the context object on every
  // position commit, so depending on it tears autoUpdate's scroll listeners and observers down
  // and rebuilds them on every scroll frame. `update` is stable.
  const { update } = context;

  // https://floating-ui.com/docs/react#anchoring
  useEffect(() => {
    if (!mounted) return;
    if (!referenceElement || !floatingElement) return;

    return autoUpdate(referenceElement, floatingElement, update);
  }, [mounted, referenceElement, floatingElement, update]);

  // Read the env()-resolved insets off the positioner (it carries the env() declarations via
  // SAFE_AREA_STYLE merged into floatingStyles below) and feed them back as px to the collision
  // boundary. Re-read on resize for orientation changes.
  useEffect(() => {
    if (!safeAreaAware || !floatingElement) return;

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
  }, [safeAreaAware, floatingElement]);

  const [side, alignment] = context.placement.split("-") as [Side, Alignment | undefined];

  const arrowStyles = useMemo(
    () =>
      ({
        position: "absolute",
        left: middlewareData.arrow?.x,
        top: middlewareData.arrow?.y,
        [side]: "100%",
        transform: ARROW_FLOATING_STYLE[side],
      }) as const,
    [middlewareData.arrow, side],
  );

  const resolvedFloatingStyles = useMemo(
    () => (safeAreaAware ? { ...SAFE_AREA_STYLE, ...floatingStyles } : floatingStyles),
    [safeAreaAware, floatingStyles],
  );

  return useMemo(
    () => ({
      open,
      onOpenChange,
      refs: {
        ...refs,
        arrow: arrowEl,
        setArrow: setArrowEl,
        arrowTip: arrowTipEl,
        setArrowTip: setArrowTipEl,
      },
      rects: {
        ...middlewareData["rects"],
        arrowTip: {
          width: arrowTipWidth,
          height: arrowTipHeight,
        },
      },
      isPositioned,
      side,
      alignment,
      context,
      floatingStyles: resolvedFloatingStyles,
      arrowStyles,
    }),
    [
      open,
      onOpenChange,
      refs,
      arrowEl,
      arrowTipEl,
      middlewareData["rects"],
      context,
      side,
      alignment,
      resolvedFloatingStyles,
      arrowStyles,
      isPositioned,
      arrowTipWidth,
      arrowTipHeight,
    ],
  );
}

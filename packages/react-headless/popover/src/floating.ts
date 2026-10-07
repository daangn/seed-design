import {
  arrow,
  autoUpdate,
  flip,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
  type Alignment,
  type ExtendedRefs,
  type FloatingContext,
  type Middleware,
  type Padding,
  type Placement,
  type Rect,
  type ReferenceType,
  type Side,
} from "@floating-ui/react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

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
   * The virtual padding around the viewport edges to check for overflow. On an edge with a
   * safe-area inset, it is added to the inset.
   * @default 8
   */
  overflowPadding?: number;
  /**
   * The minimum padding between the arrow and the floating element's corner.
   * @default 4
   */
  arrowPadding?: number;
}

const defaultPositioningOptions: PositioningOptions = {
  strategy: "absolute",
  placement: "bottom",
  flip: true,
  slide: true,
  overflowPadding: 8,
  arrowPadding: 4,
};

// flip/shift/size derive collisions from numeric padding, so the safe-area insets have to
// reach floating-ui as numbers — a CSS env() value alone can't. The positioner re-declares
// the insets from env() and the hook reads them back as px, which keeps this layer
// self-contained from the global SEED safe-area tokens.
const SAFE_AREA_STYLE = {
  "--seed-safe-area-top": "env(safe-area-inset-top)",
  "--seed-safe-area-right": "env(safe-area-inset-right)",
  "--seed-safe-area-bottom": "env(safe-area-inset-bottom)",
  "--seed-safe-area-left": "env(safe-area-inset-left)",
} as CSSProperties;

const SIDES = ["top", "right", "bottom", "left"] as const satisfies readonly Side[];

const ZERO_INSETS: Record<Side, number> = { top: 0, right: 0, bottom: 0, left: 0 };

function getArrowMiddleware(arrowElement: HTMLElement | null, opts: PositioningOptions) {
  if (!arrowElement) return;
  return arrow({ element: arrowElement, padding: opts.arrowPadding });
}

function getOffsetMiddleware(arrowOffset: number, opts: PositioningOptions) {
  const offsetMainAxis = (opts.gutter ?? 0) + arrowOffset;
  return offset(offsetMainAxis);
}

function getFlipMiddleware(opts: PositioningOptions, padding: Padding) {
  if (!opts.flip) return;
  return flip({
    padding,
    fallbackPlacements: opts.flip === true ? undefined : opts.flip,
  });
}

function getShiftMiddleware(opts: PositioningOptions, padding: Padding) {
  if (!opts.slide) return;
  return shift({
    mainAxis: opts.slide,
    padding,
    limiter: limitShift(),
  });
}

function getSizeMiddleware(padding: Padding) {
  return size({
    padding,
    apply({ availableWidth, elements }) {
      elements.floating.style.setProperty(
        "--seed-popover-available-width",
        `${Math.max(0, availableWidth)}px`,
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

export interface UsePositionedFloatingProps extends PositioningOptions {
  /**
   * Whether the floating element is initially open
   */
  defaultOpen?: boolean;
  /**
   * Whether the floating element is open
   */
  open?: boolean;
  /**
   * Callback when the floating element is opened or closed
   */
  onOpenChange?: (open: boolean) => void;
}

const ARROW_FLOATING_STYLE = {
  top: "",
  right: "rotate(90deg)",
  bottom: "rotate(180deg)",
  left: "rotate(270deg)",
} as const;

// Explicit return type interface - leveraging @floating-ui/react types
export interface UsePositionedFloatingReturn<RT extends ReferenceType = ReferenceType> {
  open: boolean;
  onOpenChange: ((open: boolean) => void) | undefined;
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

export function usePositionedFloating<RT extends ReferenceType = ReferenceType>(
  props: UsePositionedFloatingProps,
): UsePositionedFloatingReturn<RT> {
  const options = { ...defaultPositioningOptions, ...props };

  const [open, onOpenChange] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
  });
  const [arrowEl, setArrowEl] = useState<HTMLElement | null>(null);
  const [arrowTipEl, setArrowTipEl] = useState<HTMLElement | null>(null);

  const arrowTipWidth = arrowTipEl?.clientWidth ?? 0;
  const arrowTipHeight = arrowTipEl?.clientHeight ?? 0;
  const arrowTipOffset = arrowTipHeight;

  const [safeArea, setSafeArea] = useState(ZERO_INSETS);

  // overflowPadding is measured from the safe area's boundary, so it keeps the same gap from
  // what's visible whether or not an edge has an inset.
  const overflowPadding = options.overflowPadding ?? 0;
  const collisionPadding = {
    top: safeArea.top + overflowPadding,
    right: safeArea.right + overflowPadding,
    bottom: safeArea.bottom + overflowPadding,
    left: safeArea.left + overflowPadding,
  };

  const {
    refs,
    context,
    floatingStyles: positionStyles,
    middlewareData,
    isPositioned,
  } = useFloating<RT>({
    strategy: options.strategy,
    open,
    placement: options.placement,
    onOpenChange: onOpenChange,
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

  // https://floating-ui.com/docs/react#anchoring
  useEffect(() => {
    if (!open) return;
    if (!refs.reference.current || !refs.floating.current) return;

    return autoUpdate(refs.reference.current, refs.floating.current, context.update);
  }, [open, refs.reference, refs.floating, context]);

  // Read the env()-resolved insets back off the positioner. Keyed on the reactive
  // `elements.floating`: `refs.floating` never changes identity, so an effect on it would
  // run once before the positioner commits and never again. Re-read on resize for
  // orientation changes.
  const floatingElement = context.elements.floating;

  useEffect(() => {
    if (!floatingElement) return;

    const read = () => {
      const styles = getComputedStyle(floatingElement);
      const inset = (side: Side) =>
        Number.parseInt(styles.getPropertyValue(`--seed-safe-area-${side}`), 10) || 0;
      const next = {
        top: inset("top"),
        right: inset("right"),
        bottom: inset("bottom"),
        left: inset("left"),
      };

      setSafeArea((prev) => (SIDES.every((side) => prev[side] === next[side]) ? prev : next));
    };

    read();
    window.addEventListener("resize", read);

    return () => window.removeEventListener("resize", read);
  }, [floatingElement]);

  const floatingStyles = useMemo(
    () => ({ ...SAFE_AREA_STYLE, ...positionStyles }),
    [positionStyles],
  );

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
      floatingStyles,
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
      floatingStyles,
      arrowStyles,
      isPositioned,
      arrowTipWidth,
      arrowTipHeight,
    ],
  );
}

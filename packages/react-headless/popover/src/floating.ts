import {
  arrow,
  autoUpdate,
  flip,
  limitShift,
  offset,
  shift,
  useFloating,
  type Alignment,
  type ElementRects,
  type ExtendedRefs,
  type FloatingContext,
  type Middleware,
  type MiddlewareData,
  type Placement,
  type Rect,
  type ReferenceType,
  type Side,
} from "@floating-ui/react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useMemo, useState, type CSSProperties } from "react";

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
}

const defaultPositioningOptions: PositioningOptions = {
  strategy: "absolute",
  placement: "bottom",
  flip: true,
  slide: true,
  overflowPadding: 8,
  arrowPadding: 4,
};

function getArrowMiddleware(arrowElement: HTMLElement | null, opts: PositioningOptions) {
  if (!arrowElement) return;
  return arrow({ element: arrowElement, padding: opts.arrowPadding });
}

function getOffsetMiddleware(arrowOffset: number, opts: PositioningOptions) {
  const offsetMainAxis = (opts.gutter ?? 0) + arrowOffset;
  return offset(offsetMainAxis);
}

function getFlipMiddleware(opts: PositioningOptions) {
  if (!opts.flip) return;
  return flip({
    padding: opts.overflowPadding,
    fallbackPlacements: opts.flip === true ? undefined : opts.flip,
  });
}

function getShiftMiddleware(opts: PositioningOptions) {
  if (!opts.slide) return;
  return shift({
    mainAxis: opts.slide,
    padding: opts.overflowPadding,
    limiter: limitShift(),
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

// Helper function to create the return object
function createPositionedFloatingReturn<RT extends ReferenceType = ReferenceType>(params: {
  open: boolean;
  onOpenChange: ((open: boolean) => void) | undefined;
  refs: ExtendedRefs<RT>;
  arrowEl: HTMLElement | null;
  setArrowEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  arrowTipEl: HTMLElement | null;
  setArrowTipEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  middlewareData: MiddlewareData;
  arrowTipWidth: number;
  arrowTipHeight: number;
  isPositioned: boolean;
  side: Side;
  alignment: Alignment | undefined;
  context: FloatingContext<RT>;
  floatingStyles: CSSProperties;
  arrowStyles: CSSProperties;
}): UsePositionedFloatingReturn<RT> {
  return {
    open: params.open,
    onOpenChange: params.onOpenChange,
    refs: {
      ...params.refs,
      arrow: params.arrowEl,
      setArrow: params.setArrowEl,
      arrowTip: params.arrowTipEl,
      setArrowTip: params.setArrowTipEl,
    },
    rects: {
      ...params.middlewareData["rects"],
      arrowTip: {
        width: params.arrowTipWidth,
        height: params.arrowTipHeight,
      },
    },
    isPositioned: params.isPositioned,
    side: params.side,
    alignment: params.alignment,
    context: params.context,
    floatingStyles: params.floatingStyles,
    arrowStyles: params.arrowStyles,
  };
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

  const { refs, context, floatingStyles, middlewareData, isPositioned } = useFloating<RT>({
    strategy: options.strategy,
    open,
    placement: options.placement,
    onOpenChange: onOpenChange,
    whileElementsMounted: autoUpdate,
    middleware: [
      getOffsetMiddleware(arrowTipOffset, options),
      getFlipMiddleware(options),
      getShiftMiddleware(options),
      getArrowMiddleware(arrowEl, options),
      rectMiddleware,
    ],
  });

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
    () =>
      createPositionedFloatingReturn({
        open,
        onOpenChange,
        refs,
        arrowEl,
        setArrowEl,
        arrowTipEl,
        setArrowTipEl,
        middlewareData,
        arrowTipWidth,
        arrowTipHeight,
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

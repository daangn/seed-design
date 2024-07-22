import {
  arrow,
  autoUpdate,
  flip,
  limitShift,
  offset,
  shift,
  useFloating,
  type ElementRects,
  type Middleware,
  type Placement,
  type Rect,
} from "@floating-ui/react";
import { useMemo, useState } from "react";

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

function getArrowRect(arrowElement: HTMLElement | null): Rect | null {
  return arrowElement?.getClientRects().item(0) ?? null;
}

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

export function usePositionedFloating(props: UsePositionedFloatingProps) {
  const options = { ...defaultPositioningOptions, ...props };

  const [uncontrolledOpen, setUncontrolledOpen] = useState(props.defaultOpen);
  const [arrowEl, setArrowEl] = useState<HTMLElement | null>(null);
  const arrowRect = useMemo(() => getArrowRect(arrowEl), [arrowEl]);
  const arrowOffset = arrowRect?.height ?? 0;

  const open = props.open ?? uncontrolledOpen;
  const onOpenChange = props.onOpenChange ?? setUncontrolledOpen;

  const { refs, context, floatingStyles, middlewareData } = useFloating({
    strategy: options.strategy,
    open,
    placement: options.placement,
    onOpenChange: onOpenChange,
    whileElementsMounted: autoUpdate,
    middleware: [
      getOffsetMiddleware(arrowOffset, options),
      getFlipMiddleware(options),
      getShiftMiddleware(options),
      getArrowMiddleware(arrowEl, options),
      rectMiddleware,
    ],
  });

  const side = context.placement.split("-")[0] as "top" | "bottom" | "left" | "right";

  const arrowStyles = {
    position: "absolute",
    left: middlewareData.arrow?.x,
    top: middlewareData.arrow?.y,
    [side]: "100%",
    transform: ARROW_FLOATING_STYLE[side],
  } as const;

  return {
    open,
    refs: {
      ...refs,
      arrow: arrowEl,
      setArrow: setArrowEl,
    },
    rects: {
      ...(middlewareData.rects as ElementRects),
      arrow: arrowRect,
    },
    context,
    floatingStyles,
    arrowStyles,
  };
}

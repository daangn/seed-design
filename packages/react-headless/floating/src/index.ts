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
  type MiddlewareState,
  type OpenChangeReason,
  type Padding,
  type Placement,
  type Rect,
  type ReferenceType,
  type Side,
} from "@floating-ui/react";
import {
  observeSafeAreaInsets,
  readSafeAreaInsets,
  safeAreaInsetStyle,
} from "@seed-design/dom-utils";
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

type DerivePadding = (state: MiddlewareState) => Padding;

function getArrowMiddleware(arrowElement: HTMLElement | null, opts: PositioningOptions) {
  if (!arrowElement) return;
  return arrow({ element: arrowElement, padding: opts.arrowPadding });
}

function getOffsetMiddleware(arrowOffset: number, opts: PositioningOptions) {
  const offsetMainAxis = (opts.gutter ?? 0) + arrowOffset;
  return offset(offsetMainAxis);
}

function getFlipMiddleware(opts: PositioningOptions, padding: DerivePadding) {
  if (!opts.flip) return;

  const fallbackPlacements = opts.flip === true ? undefined : opts.flip;

  return flip((state) => ({ padding: padding(state), fallbackPlacements }));
}

function getShiftMiddleware(opts: PositioningOptions, padding: DerivePadding) {
  if (!opts.slide) return;
  return shift((state) => ({
    mainAxis: opts.slide,
    padding: padding(state),
    limiter: limitShift(),
  }));
}

function getSizeMiddleware(padding: DerivePadding) {
  return size((state) => ({
    padding: padding(state),
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
  }));
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

  const arrowTipWidth = arrowTipEl?.clientWidth ?? 0;
  const arrowTipHeight = arrowTipEl?.clientHeight ?? 0;
  const arrowTipOffset = arrowTipHeight;

  // overflowPadding is measured from the safe area's boundary, so it keeps the same gap from
  // what's visible whether or not an edge has an inset.
  const overflowPadding = options.overflowPadding ?? 0;
  // host는 resize 없이 inset을 바꿀 수 있어서, 위치를 계산할 때마다 positioner의 inset을
  // 새로 읽어요.
  const collisionPadding: DerivePadding = ({ elements }) => {
    const insets = readSafeAreaInsets(elements.floating);

    return {
      top: insets.top + overflowPadding,
      right: insets.right + overflowPadding,
      bottom: insets.bottom + overflowPadding,
      left: insets.left + overflowPadding,
    };
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

  // https://floating-ui.com/docs/react#anchoring
  useEffect(() => {
    if (!open) return;
    if (!refs.reference.current || !refs.floating.current) return;

    return autoUpdate(refs.reference.current, refs.floating.current, context.update);
  }, [open, refs.reference, refs.floating, context]);

  // floating-ui는 위치를 확정할 때마다 `context`를 새로 만들지만 `update`는 그대로예요.
  const { update } = context;

  useEffect(() => {
    if (!open) return;

    return observeSafeAreaInsets(update);
  }, [open, update]);

  const floatingStyles = useMemo(
    () => ({ ...safeAreaInsetStyle, ...positionStyles }),
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

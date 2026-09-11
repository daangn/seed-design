import { helpBubble, type HelpBubbleVariantProps } from "@seed-design/lynx-css/recipes/help-bubble";
import { getRectByRef } from "@lynx-js/lynx-ui-common";
import type { NodesRef } from "@lynx-js/types";
import * as React from "@lynx-js/react";
import clsx from "clsx";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { useStyleProps, type StyleProps } from "../../utils/styled";
import {
  computePosition,
  type Placement,
  type Position,
  type Rect,
  type Side,
} from "../private/Positioning";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(helpBubble);

type HelpBubblePublicVariantProps = Omit<
  HelpBubbleVariantProps,
  "open" | "positioned" | "side" | "pressed"
>;
type NativeTapHandler = NonNullable<LynxViewProps["bindtap"]>;
type NativeLayoutHandler = NonNullable<LynxViewProps["bindlayoutchange"]>;
type NativeTransitionHandler = NonNullable<LynxViewProps["bindtransitionend"]>;

interface HelpBubbleContextValue {
  open: boolean;
  mounted: boolean;
  positioned: boolean;
  side: Side;
  placement: Placement;
  gutter: number;
  overflowPadding: number;
  arrowPadding: number;
  flip: HelpBubbleRootProps["flip"];
  closeOnInteractOutside: boolean;
  openEpoch: number;
  isOpenRef: React.MutableRefObject<boolean>;
  openEpochRef: React.MutableRefObject<number>;
  anchorRef: React.MutableRefObject<NodesRef | null>;
  triggerRef: React.MutableRefObject<NodesRef | null>;
  position: Position | null;
  referenceRect: Rect | null;
  positionRevision: number;
  positionRevisionRef: React.MutableRefObject<number>;
  requestOpen: (nextOpen: boolean) => void;
  finishClose: () => void;
  setPosition: (position: Position | null, referenceRect: Rect | null) => void;
  resetPosition: () => void;
  requestPositionUpdate: () => void;
}

const HelpBubbleContext = React.createContext<HelpBubbleContextValue | null>(null);

function useHelpBubbleContext(consumer: string): HelpBubbleContextValue {
  const context = React.useContext(HelpBubbleContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <HelpBubbleRoot/>.`);
  return context;
}

function mergeNodeRef(forwardedRef: React.ForwardedRef<unknown>, node: NodesRef | null) {
  if (typeof forwardedRef === "function") forwardedRef(node);
  else if (forwardedRef) forwardedRef.current = node;
}

function toPixel(value: number) {
  return `${value}px`;
}

function getLayoutSize(
  event: Parameters<NativeLayoutHandler>[0],
): { width: number; height: number } | null {
  const width = event.detail?.width ?? event.params?.width;
  const height = event.detail?.height ?? event.params?.height;
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  return { width: Math.max(0, width), height: Math.max(0, height) };
}

function hasExitTransition(event: Parameters<NativeTransitionHandler>[0]): boolean {
  if (event.target.uid !== event.currentTarget.uid) return false;
  return (
    event.params.animation_type === "transition-opacity" ||
    event.params.animation_name === "opacity"
  );
}

function getRootRect() {
  "background only";
  return getRectByRef({ current: lynx.createSelectorQuery().selectRoot() }, true);
}

function areStylesEqual(left: object | undefined, right: object | undefined) {
  if (left === right) return true;
  if (!left || !right) return false;
  const leftEntries = Object.entries(left);
  if (leftEntries.length !== Object.keys(right).length) return false;
  return leftEntries.every(([key, value]) =>
    Object.is(value, (right as Record<string, unknown>)[key]),
  );
}

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleRootProps extends HelpBubblePublicVariantProps, LynxStyledElementProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @default "top" */
  placement?: Placement;
  /** @default 4 */
  gutter?: number;
  /** @default 16 */
  overflowPadding?: number;
  /** @default 14 */
  arrowPadding?: number;
  /** @default true */
  flip?:
    | boolean
    | {
        fallbackStrategy?: "bestFit" | "initialPlacement";
        fallbackPlacements?: Placement[];
      };
  /** @default true */
  closeOnInteractOutside?: boolean;
}

/**
 * @platform Lynx
 *
 * The native implementation uses fixed positioned views rather than DOM portals.
 * `closeOnInteractOutside={false}` has no full-screen hit surface, so other native
 * controls and independently-open HelpBubbles remain interactive.
 */
export const HelpBubbleRoot = React.forwardRef<unknown, HelpBubbleRootProps>((props, ref) => {
  const {
    children,
    className,
    style,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    placement = "top",
    gutter = 4,
    overflowPadding = 16,
    arrowPadding = 14,
    flip = true,
    closeOnInteractOutside = true,
    ...nativeProps
  } = props;
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
  });
  const [mounted, setMounted] = React.useState(open);
  const [position, setPositionState] = React.useState<Position | null>(null);
  const [positionedEpoch, setPositionedEpoch] = React.useState<number | null>(null);
  const [referenceRect, setReferenceRect] = React.useState<Rect | null>(null);
  const [positionRevision, setPositionRevision] = React.useState(0);
  const positionRevisionRef = React.useRef(0);
  const isOpenRef = React.useRef(open);
  const openEpochRef = React.useRef(0);
  const anchorRef = React.useRef<NodesRef | null>(null);
  const triggerRef = React.useRef<NodesRef | null>(null);

  if (open && !isOpenRef.current) openEpochRef.current += 1;
  isOpenRef.current = open;
  const openEpoch = openEpochRef.current;
  const positioned = positionedEpoch === openEpoch;

  React.useEffect(() => {
    "background only";
    if (open) {
      setMounted(true);
      return;
    }
    if (!positioned) setMounted(false);
  }, [open, positioned]);

  const requestOpen = React.useCallback(
    (nextOpen: boolean) => {
      "background only";
      if (nextOpen === open) return;
      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open, setOpen],
  );
  const finishClose = React.useCallback(() => {
    "background only";
    if (!isOpenRef.current) {
      setMounted(false);
      setPositionedEpoch(null);
      setPositionState(null);
      setReferenceRect(null);
    }
  }, []);
  const setPosition = React.useCallback(
    (nextPosition: Position | null, nextReferenceRect: Rect | null) => {
      setPositionState((previous) => {
        if (
          previous !== null &&
          nextPosition !== null &&
          previous.left === nextPosition.left &&
          previous.top === nextPosition.top &&
          previous.width === nextPosition.width &&
          previous.height === nextPosition.height &&
          previous.placement === nextPosition.placement &&
          previous.transformOrigin === nextPosition.transformOrigin &&
          previous.availableWidth === nextPosition.availableWidth &&
          previous.availableHeight === nextPosition.availableHeight &&
          previous.arrow?.left === nextPosition.arrow?.left &&
          previous.arrow?.top === nextPosition.arrow?.top &&
          previous.arrow?.centerOffset === nextPosition.arrow?.centerOffset
        ) {
          return previous;
        }
        return nextPosition;
      });
      setReferenceRect((previous) => {
        if (
          previous !== null &&
          nextReferenceRect !== null &&
          previous.left === nextReferenceRect.left &&
          previous.top === nextReferenceRect.top &&
          previous.right === nextReferenceRect.right &&
          previous.bottom === nextReferenceRect.bottom &&
          previous.width === nextReferenceRect.width &&
          previous.height === nextReferenceRect.height
        ) {
          return previous;
        }
        return nextReferenceRect;
      });
      setPositionedEpoch(nextPosition ? openEpochRef.current : null);
    },
    [],
  );
  const resetPosition = React.useCallback(() => {
    setPositionState(null);
    setReferenceRect(null);
    setPositionedEpoch(null);
  }, []);
  const requestPositionUpdate = React.useCallback(() => {
    positionRevisionRef.current += 1;
    setPositionRevision(positionRevisionRef.current);
  }, []);
  const classes = helpBubble({
    open,
    positioned,
    side: position?.placement.split("-")[0] as Side | undefined,
    pressed: false,
  });
  const contextValue = React.useMemo<HelpBubbleContextValue>(
    () => ({
      open,
      mounted,
      positioned,
      side: (position?.placement.split("-")[0] as Side | undefined) ?? "top",
      placement,
      gutter,
      overflowPadding,
      arrowPadding,
      flip,
      closeOnInteractOutside,
      openEpoch,
      isOpenRef,
      openEpochRef,
      anchorRef,
      triggerRef,
      position,
      referenceRect,
      positionRevision,
      positionRevisionRef,
      requestOpen,
      finishClose,
      setPosition,
      resetPosition,
      requestPositionUpdate,
    }),
    [
      arrowPadding,
      closeOnInteractOutside,
      finishClose,
      flip,
      gutter,
      mounted,
      open,
      openEpoch,
      overflowPadding,
      placement,
      position,
      positioned,
      requestOpen,
      resetPosition,
      setPosition,
      referenceRect,
      positionRevisionRef,
      positionRevision,
      requestPositionUpdate,
    ],
  );

  return (
    <HelpBubbleContext.Provider value={contextValue}>
      <ClassNamesProvider value={classes}>
        <view
          {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
          className={className}
          style={style}
        >
          {children}
        </view>
      </ClassNamesProvider>
    </HelpBubbleContext.Provider>
  );
});
HelpBubbleRoot.displayName = "HelpBubbleRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleAnchorProps
  extends LynxStyledElementProps,
    Pick<LynxViewProps, "bindlayoutchange"> {}

export const HelpBubbleAnchor = React.forwardRef<unknown, HelpBubbleAnchorProps>((props, ref) => {
  const { children, className, style, bindlayoutchange, ...nativeProps } = props;
  const context = useHelpBubbleContext("HelpBubbleAnchor");
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      context.anchorRef.current = node;
      mergeNodeRef(ref, node);
    },
    [context.anchorRef, ref],
  );
  const handleLayoutChange = React.useCallback<NativeLayoutHandler>(
    (...args) => {
      "background only";
      context.requestPositionUpdate();
      bindlayoutchange?.(...args);
    },
    [bindlayoutchange, context.requestPositionUpdate],
  );

  return (
    <view
      ref={handleRef as LynxViewRef}
      className={className}
      style={style}
      bindlayoutchange={handleLayoutChange}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
HelpBubbleAnchor.displayName = "HelpBubbleAnchor";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleTriggerProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps,
    Pick<LynxViewProps, "bindlayoutchange"> {}

export const HelpBubbleTrigger = React.forwardRef<unknown, HelpBubbleTriggerProps>((props, ref) => {
  const {
    children,
    className,
    style,
    bindtap,
    bindlayoutchange,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const context = useHelpBubbleContext("HelpBubbleTrigger");
  const handleTap = React.useCallback<NativeTapHandler>(
    (event, instance) => {
      "background only";
      context.requestOpen(!context.open);
      bindtap?.(event, instance);
    },
    [bindtap, context],
  );
  const { bindtap: triggerTap, ...pressHandlers } = usePressTap({
    onTap: handleTap,
    mainThreadOnTap: mainThreadBindtap,
  });
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      context.triggerRef.current = node;
      mergeNodeRef(ref, node);
    },
    [context.triggerRef, ref],
  );
  const handleLayoutChange = React.useCallback<NativeLayoutHandler>(
    (...args) => {
      "background only";
      context.requestPositionUpdate();
      bindlayoutchange?.(...args);
    },
    [bindlayoutchange, context.requestPositionUpdate],
  );

  return (
    <view
      ref={handleRef as LynxViewRef}
      className={className}
      style={style}
      accessibility-element={accessibilityElement}
      accessibility-label={accessibilityLabel}
      accessibility-role-description="button"
      accessibility-value={context.open ? "expanded" : "collapsed"}
      accessibility-traits={accessibilityTraits ?? "button"}
      {...nativeProps}
      {...pressHandlers}
      bindtap={triggerTap}
      bindlayoutchange={handleLayoutChange}
    >
      {children}
    </view>
  );
});
HelpBubbleTrigger.displayName = "HelpBubbleTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubblePositionerProps extends LynxStyledElementProps {
  zIndexOffset?: number;
}

function OutsidePressCatcher({
  referenceRect,
  onTap,
}: {
  referenceRect: Rect;
  onTap: NativeTapHandler;
}) {
  const screen = typeof SystemInfo === "undefined" ? undefined : SystemInfo;
  const pixelRatio = screen?.pixelRatio;
  const width = screen?.pixelWidth;
  const height = screen?.pixelHeight;
  if (
    typeof pixelRatio !== "number" ||
    pixelRatio <= 0 ||
    typeof width !== "number" ||
    typeof height !== "number"
  ) {
    return null;
  }

  const screenWidth = width / pixelRatio;
  const screenHeight = height / pixelRatio;
  const left = Math.max(0, referenceRect.left);
  const top = Math.max(0, referenceRect.top);
  const right = Math.min(screenWidth, referenceRect.right);
  const bottom = Math.min(screenHeight, referenceRect.bottom);
  const areas = [
    { top: 0, left: 0, width: screenWidth, height: top },
    { top: bottom, left: 0, width: screenWidth, height: Math.max(0, screenHeight - bottom) },
    { top, left: 0, width: left, height: Math.max(0, bottom - top) },
    {
      top,
      left: right,
      width: Math.max(0, screenWidth - right),
      height: Math.max(0, bottom - top),
    },
  ];

  return (
    <>
      {areas.map((area, index) =>
        area.width > 0 && area.height > 0 ? (
          <view
            key={index}
            style={{
              position: "fixed",
              top: toPixel(area.top),
              left: toPixel(area.left),
              width: toPixel(area.width),
              height: toPixel(area.height),
              zIndex: 0,
            }}
            bindtap={onTap}
          />
        ) : null,
      )}
    </>
  );
}

export const HelpBubblePositioner = React.forwardRef<unknown, HelpBubblePositionerProps>(
  (props, ref) => {
    const { children, className, style, zIndexOffset = 0, ...nativeProps } = props;
    const context = useHelpBubbleContext("HelpBubblePositioner");
    const classNames = useClassNames();
    const handleOutsideTap = React.useCallback<NativeTapHandler>(() => {
      "background only";
      context.requestOpen(false);
    }, [context.requestOpen]);

    if (!context.mounted) return null;

    return (
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(classNames.positioner, className)}
        style={{
          left: toPixel(context.position?.left ?? 0),
          top: toPixel(context.position?.top ?? 0),
          width: context.position ? toPixel(context.position.width) : undefined,
          zIndex: 99 + zIndexOffset,
          ...style,
        }}
      >
        {context.closeOnInteractOutside && context.open && context.referenceRect ? (
          <OutsidePressCatcher referenceRect={context.referenceRect} onTap={handleOutsideTap} />
        ) : null}
        {children}
      </view>
    );
  },
);
HelpBubblePositioner.displayName = "HelpBubblePositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleContentProps
  extends Pick<StyleProps, "maxWidth">,
    LynxStyledElementProps {}

export const HelpBubbleContent = React.forwardRef<unknown, HelpBubbleContentProps>((props, ref) => {
  const { style, restProps } = useStyleProps(props);
  const { children, className, ...nativeProps } = restProps;
  const context = useHelpBubbleContext("HelpBubbleContent");
  const measurementVersionRef = React.useRef(0);
  const intrinsicWidthRef = React.useRef<number | null>(null);
  const measurementConfigRef = React.useRef(0);
  const configuredClassNameRef = React.useRef(className);
  const configuredStyleRef = React.useRef(style);
  const [contentNode, setContentNode] = React.useState<NodesRef | null>(null);
  const [measurementRevision, setMeasurementRevision] = React.useState(0);
  const [intrinsicSize, setIntrinsicSize] = React.useState<{
    width: number;
    height: number;
    epoch: number;
    config: number;
  } | null>(null);
  const [widthConstraint, setWidthConstraint] = React.useState<number | null>(null);

  const measureIntrinsicSize = React.useCallback(async () => {
    "background only";
    const openEpoch = context.openEpoch;
    const config = measurementConfigRef.current;
    if (!context.open || !contentNode) return;
    const version = ++measurementVersionRef.current;
    try {
      const rect = await getRectByRef({ current: contentNode }, true);
      if (
        version !== measurementVersionRef.current ||
        !context.isOpenRef.current ||
        openEpoch !== context.openEpochRef.current ||
        config !== measurementConfigRef.current
      ) {
        return;
      }
      if (intrinsicWidthRef.current === null) intrinsicWidthRef.current = rect.width;
      setIntrinsicSize((current) => {
        const width = intrinsicWidthRef.current ?? rect.width;
        if (
          current?.width === width &&
          current.height === rect.height &&
          current.epoch === openEpoch &&
          current.config === config
        ) {
          return current;
        }
        return { width, height: rect.height, epoch: openEpoch, config };
      });
    } catch {
      // A native ref can disappear while an async selector query is in flight.
    }
  }, [contentNode, context.isOpenRef, context.open, context.openEpoch, context.openEpochRef]);

  const measurePosition = React.useCallback(async () => {
    "background only";
    const referenceNode = context.anchorRef.current ?? context.triggerRef.current;
    const openEpoch = context.openEpoch;
    const positionRevision = context.positionRevisionRef.current;
    if (
      !context.open ||
      !referenceNode ||
      !intrinsicSize ||
      intrinsicSize.epoch !== openEpoch ||
      intrinsicSize.config !== measurementConfigRef.current
    ) {
      return;
    }
    const version = ++measurementVersionRef.current;
    try {
      const [reference, boundary] = await Promise.all([
        getRectByRef({ current: referenceNode }, true),
        getRootRect(),
      ]);
      if (
        version !== measurementVersionRef.current ||
        !context.isOpenRef.current ||
        openEpoch !== context.openEpochRef.current ||
        positionRevision !== context.positionRevisionRef.current
      ) {
        return;
      }
      const width = widthConstraint ?? intrinsicWidthRef.current ?? intrinsicSize.width;
      const nextPosition = await computePosition({
        reference,
        boundary,
        width,
        height: intrinsicSize.height,
        placement: context.placement,
        gutter: context.gutter,
        overflowPadding: context.overflowPadding,
        flip:
          context.flip === false
            ? false
            : context.flip === true
              ? { fallbackStrategy: "bestFit" }
              : context.flip,
        shift: { crossAxis: true, limit: true },
        arrow: { size: 12, tipHeight: 8, padding: context.arrowPadding },
      });
      if (
        version !== measurementVersionRef.current ||
        !context.isOpenRef.current ||
        openEpoch !== context.openEpochRef.current ||
        positionRevision !== context.positionRevisionRef.current
      ) {
        return;
      }
      if (nextPosition.availableWidth < width) {
        const constrainedWidth = nextPosition.availableWidth;
        if (widthConstraint !== constrainedWidth) {
          setWidthConstraint(constrainedWidth);
          setIntrinsicSize(null);
          context.resetPosition();
          setMeasurementRevision((current) => current + 1);
        }
        return;
      }
      context.setPosition(nextPosition, reference);
    } catch {
      // A native ref can disappear while an async selector query is in flight.
      // The current epoch stays unpositioned and therefore hidden.
    }
  }, [
    context.anchorRef,
    context.arrowPadding,
    context.flip,
    context.gutter,
    context.isOpenRef,
    context.open,
    context.openEpoch,
    context.openEpochRef,
    context.overflowPadding,
    context.placement,
    context.resetPosition,
    context.setPosition,
    context.triggerRef,
    intrinsicSize,
    widthConstraint,
  ]);

  React.useEffect(() => {
    "background only";
    measurementVersionRef.current += 1;
    intrinsicWidthRef.current = null;
    setWidthConstraint(null);
    setIntrinsicSize(null);
    context.resetPosition();
  }, [context.openEpoch, context.resetPosition]);
  React.useEffect(() => {
    "background only";
    if (
      configuredClassNameRef.current === className &&
      areStylesEqual(configuredStyleRef.current, style)
    ) {
      return;
    }
    measurementVersionRef.current += 1;
    intrinsicWidthRef.current = null;
    measurementConfigRef.current += 1;
    configuredClassNameRef.current = className;
    configuredStyleRef.current = style;
    setWidthConstraint(null);
    setIntrinsicSize(null);
    context.resetPosition();
    setMeasurementRevision((current) => current + 1);
  }, [className, context.resetPosition, style]);
  React.useEffect(() => {
    "background only";
    if (!context.open) return;
    const frame = requestAnimationFrame(() => {
      "background only";
      void measureIntrinsicSize();
    });
    return () => cancelAnimationFrame(frame);
  }, [context.open, context.openEpoch, measureIntrinsicSize, measurementRevision]);
  React.useEffect(() => {
    "background only";
    if (!context.open) return;
    let disposed = false;
    let frame: number | undefined;
    const trackPosition = () => {
      void measurePosition().finally(() => {
        if (!disposed && context.isOpenRef.current) {
          frame = requestAnimationFrame(trackPosition);
        }
      });
    };
    trackPosition();
    return () => {
      disposed = true;
      measurementVersionRef.current += 1;
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [
    context.isOpenRef,
    context.open,
    context.openEpoch,
    context.positionRevision,
    measurePosition,
  ]);

  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      measurementVersionRef.current += 1;
      setContentNode(node);
      mergeNodeRef(ref, node);
    },
    [ref],
  );
  const handleLayoutChange = React.useCallback<NativeLayoutHandler>(
    (event) => {
      "background only";
      const nextSize = getLayoutSize(event);
      if (!nextSize || !context.open) return;
      measurementVersionRef.current += 1;
      if (intrinsicWidthRef.current === null) intrinsicWidthRef.current = nextSize.width;
      setIntrinsicSize((current) => {
        const width = intrinsicWidthRef.current ?? nextSize.width;
        if (
          current?.width === width &&
          current.height === nextSize.height &&
          current.epoch === context.openEpoch &&
          current.config === measurementConfigRef.current
        ) {
          return current;
        }
        return {
          width,
          height: nextSize.height,
          epoch: context.openEpoch,
          config: measurementConfigRef.current,
        };
      });
    },
    [context.open, context.openEpoch],
  );
  const handleTransitionEnd = React.useCallback<NativeTransitionHandler>(
    (event) => {
      "background only";
      if (!context.open && hasExitTransition(event)) context.finishClose();
    },
    [context],
  );

  return (
    <view
      ref={handleRef as LynxViewRef}
      className={clsx(useClassNames().content, className)}
      style={{ ...style, ...(widthConstraint != null ? { width: toPixel(widthConstraint) } : {}) }}
      bindlayoutchange={handleLayoutChange}
      bindtransitionend={handleTransitionEnd}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
HelpBubbleContent.displayName = "HelpBubbleContent";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleArrowProps extends LynxStyledElementProps {}

export const HelpBubbleArrow = React.forwardRef<unknown, HelpBubbleArrowProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const context = useHelpBubbleContext("HelpBubbleArrow");
  const arrow = context.position?.arrow;
  const side = context.side;
  const geometryStyle =
    side === "top"
      ? { left: toPixel(arrow?.left ?? 0), top: "100%" }
      : side === "bottom"
        ? { left: toPixel(arrow?.left ?? 0), bottom: "100%" }
        : side === "right"
          ? { top: toPixel(arrow?.top ?? 0), right: "100%" }
          : { top: toPixel(arrow?.top ?? 0), left: "100%" };

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(useClassNames().arrow, className)}
      style={{ ...geometryStyle, ...style }}
    >
      {children}
    </view>
  );
});
HelpBubbleArrow.displayName = "HelpBubbleArrow";

export interface HelpBubbleArrowTipProps extends LynxStyledElementProps {}

export const HelpBubbleArrowTip = React.forwardRef<unknown, HelpBubbleArrowTipProps>(
  (props, ref) => {
    const { children, className, style, ...nativeProps } = props;
    return (
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(useClassNames().arrowTip, className)}
        style={style}
        accessibility-elements-hidden={true}
      >
        {children}
      </view>
    );
  },
);
HelpBubbleArrowTip.displayName = "HelpBubbleArrowTip";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleBodyProps extends LynxStyledElementProps {}

export const HelpBubbleBody = React.forwardRef<unknown, HelpBubbleBodyProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(useClassNames().body, className)}
      style={style}
    >
      {children}
    </view>
  );
});
HelpBubbleBody.displayName = "HelpBubbleBody";

export interface HelpBubbleTitleProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const HelpBubbleTitle = React.forwardRef<unknown, HelpBubbleTitleProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      className={clsx(useClassNames().title, className)}
      style={style}
    >
      {children}
    </text>
  );
});
HelpBubbleTitle.displayName = "HelpBubbleTitle";

export interface HelpBubbleDescriptionProps
  extends LynxStyledElementProps,
    LynxAccessibilityProps {}

export const HelpBubbleDescription = React.forwardRef<unknown, HelpBubbleDescriptionProps>(
  (props, ref) => {
    const { children, className, style, ...nativeProps } = props;
    return (
      <text
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(useClassNames().description, className)}
        style={style}
      >
        {children}
      </text>
    );
  },
);
HelpBubbleDescription.displayName = "HelpBubbleDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface HelpBubbleCloseButtonProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const HelpBubbleCloseButton = React.forwardRef<unknown, HelpBubbleCloseButtonProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement = true,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits = "button",
      ...nativeProps
    } = props;
    const context = useHelpBubbleContext("HelpBubbleCloseButton");
    const handleTap = React.useCallback<NativeTapHandler>(
      (event, instance) => {
        "background only";
        bindtap?.(event, instance);
        context.requestOpen(false);
      },
      [bindtap, context],
    );
    const { pressed, ...pressHandlers } = usePressTap({
      onTap: handleTap,
      mainThreadOnTap: mainThreadBindtap,
    });
    const closeButtonClassNames = helpBubble({
      open: context.open,
      positioned: context.positioned,
      side: context.side,
      pressed,
    });

    if (process.env.NODE_ENV !== "production" && accessibilityElement && !accessibilityLabel) {
      console.warn("HelpBubbleCloseButton requires `accessibility-label` for accessibility.");
    }

    return (
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, pressHandlers, nativeProps)}
        accessibility-element={accessibilityElement}
        accessibility-label={accessibilityLabel}
        accessibility-traits={accessibilityTraits}
        className={clsx(closeButtonClassNames.closeButton, className)}
        style={style}
        flatten={false}
      >
        {children}
      </view>
    );
  },
);
HelpBubbleCloseButton.displayName = "HelpBubbleCloseButton";

import * as React from "@lynx-js/react";
import { getRectByRef } from "@lynx-js/lynx-ui-common";
import { OverlayView, type OverlayViewProps } from "@lynx-js/lynx-ui-overlay";
import type { CSSProperties, IntrinsicElements, NodesRef } from "@lynx-js/types";
import { computePosition } from "@seed-design/lynx-react-floating";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";

import { usePopover, type UsePopoverProps } from "./usePopover.js";
import { usePopoverCloseButton, type UsePopoverCloseButtonProps } from "./usePopoverCloseButton.js";
import { PopoverProvider, usePopoverContext } from "./usePopoverContext.js";

type ViewProps = IntrinsicElements["view"];
/** 위치 style을 합치는 파트는 객체 style만 받습니다. */
type StyledViewProps = Omit<ViewProps, "style"> & { style?: CSSProperties };
type TapHandler = NonNullable<ViewProps["bindtap"]>;
type LayoutHandler = NonNullable<ViewProps["bindlayoutchange"]>;

/** 닫힘 전환이 끝났다는 신호가 없을 때 Positioner를 unmount하기까지 기다리는 시간입니다. */
const EXIT_FALLBACK_MS = 200;

function toPixel(value: number) {
  return `${value}px`;
}

function assignNodeRef(ref: React.ForwardedRef<unknown>, node: NodesRef | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

function getRootRect() {
  "background only";
  return getRectByRef({ current: lynx.createSelectorQuery().selectRoot() }, true);
}

function getLayoutSize(event: Parameters<LayoutHandler>[0]) {
  const width = event.detail?.width ?? event.params?.width;
  const height = event.detail?.height ?? event.params?.height;
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  return { width: Math.max(0, width), height: Math.max(0, height) };
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
// Root
////////////////////////////////////////////////////////////////////////////////////

export interface PopoverRootProps extends UsePopoverProps {
  children?: React.ReactNode;
}

/**
 * @platform Lynx
 *
 * `usePopover` 결과를 하위 파트에 전달합니다. native 요소를 렌더링하지 않습니다.
 */
export function PopoverRoot(props: PopoverRootProps): React.ReactElement {
  const { children, ...popoverProps } = props;
  const api = usePopover(popoverProps);
  return <PopoverProvider value={api}>{children}</PopoverProvider>;
}
PopoverRoot.displayName = "PopoverRoot";

////////////////////////////////////////////////////////////////////////////////////
// Anchor / Trigger
////////////////////////////////////////////////////////////////////////////////////

export interface PopoverAnchorProps extends ViewProps {}

/**
 * 위치 기준점 native `<view>`입니다. 탭으로 열고 닫지 않고 접근성 기본값도 두지 않습니다.
 * Trigger와 함께 있으면 Anchor를 기준으로 배치합니다. layout이 바뀌면 위치를 다시 측정합니다.
 */
export const PopoverAnchor = React.forwardRef<unknown, PopoverAnchorProps>((props, ref) => {
  const { children, bindlayoutchange, ...nativeProps } = props;
  const { anchorRef, requestPositionUpdate } = usePopoverContext();
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      anchorRef.current = node;
      assignNodeRef(ref, node);
    },
    [anchorRef, ref],
  );
  const handleLayoutChange = React.useCallback<LayoutHandler>(
    (...args) => {
      "background only";
      requestPositionUpdate();
      bindlayoutchange?.(...args);
    },
    [bindlayoutchange, requestPositionUpdate],
  );

  return (
    <view
      ref={handleRef as ViewProps["ref"]}
      bindlayoutchange={handleLayoutChange}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
PopoverAnchor.displayName = "PopoverAnchor";

export interface PopoverTriggerProps extends ViewProps {}

/**
 * 탭하면 Popover를 열고 닫는 native `<view>`입니다. 열림 상태를 `accessibility-value`의
 * `"expanded"`·`"collapsed"`로 알리고 `accessibility-traits="button"`을 기본값으로 둡니다.
 * 사용자 `bindtap`은 열림 상태를 바꾼 뒤 실행합니다.
 */
export const PopoverTrigger = React.forwardRef<unknown, PopoverTriggerProps>((props, ref) => {
  const {
    children,
    bindtap,
    bindlayoutchange,
    "main-thread:bindtap": mainThreadOnTap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits = "button",
    ...nativeProps
  } = props;
  const { open, setOpen, triggerRef, requestPositionUpdate } = usePopoverContext();
  const handleTap = React.useCallback<TapHandler>(
    (...args) => {
      "background only";
      setOpen(!open);
      bindtap?.(...args);
    },
    [bindtap, open, setOpen],
  );
  const { pressed: _pressed, ...pressHandlers } = usePressTap({
    onTap: handleTap,
    mainThreadOnTap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      triggerRef.current = node;
      assignNodeRef(ref, node);
    },
    [triggerRef, ref],
  );
  const handleLayoutChange = React.useCallback<LayoutHandler>(
    (...args) => {
      "background only";
      requestPositionUpdate();
      bindlayoutchange?.(...args);
    },
    [bindlayoutchange, requestPositionUpdate],
  );

  return (
    <view
      ref={handleRef as ViewProps["ref"]}
      accessibility-element={accessibilityElement}
      accessibility-label={accessibilityLabel}
      accessibility-role-description="button"
      accessibility-value={open ? "expanded" : "collapsed"}
      accessibility-traits={accessibilityTraits}
      {...nativeProps}
      {...pressHandlers}
      bindlayoutchange={handleLayoutChange}
    >
      {children}
    </view>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

////////////////////////////////////////////////////////////////////////////////////
// Positioner
////////////////////////////////////////////////////////////////////////////////////

export interface PopoverPositionerProps
  extends StyledViewProps,
    Pick<OverlayViewProps, "container" | "overlayLevel" | "overlayViewProps"> {}

/**
 * 열려 있거나 닫힘 전환 중일 때 콘텐츠를 계산된 위치에 두는 레이어입니다. lynx-ui `OverlayView`를 사용합니다.
 *
 * - `container`가 없으면 `position: fixed`인 작은 native `<view>` 자체가 레이어입니다. 화면 전체를 덮지
 *   않으므로 아래 요소도 탭할 수 있습니다.
 * - `container`를 지정하면 Lynx view 밖까지 덮는 native `<overlay>`에 렌더링하고, 레이어 안에서
 *   `position: absolute`로 배치합니다. 레이어는 탭을 아래 화면으로 넘기고, 콘텐츠만
 *   `event-through={false}`로 탭을 받습니다.
 *
 * `closeOnInteractOutside`이면 `global-bindtap`으로 페이지의 탭을 받아, 기준 요소와 콘텐츠 밖을 탭했을 때
 * 닫습니다. 탭을 가로채지 않으므로 탭한 요소도 그 탭을 그대로 받습니다.
 */
export const PopoverPositioner = React.forwardRef<unknown, PopoverPositionerProps>((props, ref) => {
  const { children, className, style, container, overlayLevel, overlayViewProps, ...nativeProps } =
    props;
  const api = usePopoverContext();
  const { setOpen, layerRef, position, referenceRect, rootRect, layerRect } = api;
  const handleGlobalTap = React.useCallback<TapHandler>(
    (event) => {
      "background only";
      if (!position || !referenceRect || !rootRect) return;
      // 탭 좌표는 page 기준이고, 측정한 rect는 `relativeTo: "screen"` 기준입니다.
      const x = event.detail.x + rootRect.left;
      const y = event.detail.y + rootRect.top;
      const content = {
        left: position.left,
        top: position.top,
        right: position.left + position.width,
        bottom: position.top + position.height,
      };
      const tappedInside = [referenceRect, content].some(
        (rect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom,
      );
      if (tappedInside) return;
      setOpen(false);
    },
    [position, referenceRect, rootRect, setOpen],
  );
  const handleLayerRef = React.useCallback(
    (node: NodesRef | null) => {
      layerRef.current = node;
    },
    [layerRef],
  );

  if (!api.mounted) return null;

  const globalTapProps: Pick<ViewProps, "global-bindtap"> =
    api.closeOnInteractOutside && api.open ? { "global-bindtap": handleGlobalTap } : {};

  if (!container) {
    return (
      <OverlayView
        className={className}
        style={{
          position: "fixed",
          left: toPixel(position?.left ?? 0),
          top: toPixel(position?.top ?? 0),
          width: position ? toPixel(position.width) : undefined,
          ...style,
        }}
        overlayViewProps={{
          ...nativeProps,
          ...overlayViewProps,
          ...globalTapProps,
          ...(ref ? { ref: ref as ViewProps["ref"] } : {}),
        }}
      >
        {children}
      </OverlayView>
    );
  }

  const layerLeft = layerRect?.left ?? 0;
  const layerTop = layerRect?.top ?? 0;
  return (
    <OverlayView
      container={container}
      overlayLevel={overlayLevel}
      overlayViewProps={overlayViewProps}
      style={{ width: "100%", height: "100%" }}
    >
      <view
        ref={handleLayerRef as ViewProps["ref"]}
        style={{ width: "100%", height: "100%" }}
        {...globalTapProps}
      >
        <view
          {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
          {...nativeProps}
          className={className}
          style={{
            position: "absolute",
            left: toPixel((position?.left ?? 0) - layerLeft),
            top: toPixel((position?.top ?? 0) - layerTop),
            width: position ? toPixel(position.width) : undefined,
            ...style,
          }}
          event-through={false}
        >
          {children}
        </view>
      </view>
    </OverlayView>
  );
});
PopoverPositioner.displayName = "PopoverPositioner";

////////////////////////////////////////////////////////////////////////////////////
// Content
////////////////////////////////////////////////////////////////////////////////////

export interface PopoverContentProps extends StyledViewProps {}

/**
 * 크기를 측정해 위치를 계산하는 콘텐츠 native `<view>`입니다. Positioner 안에 둡니다.
 *
 * 열리면 콘텐츠 크기, 기준 요소, root 경계를 비동기로 측정하고 매 frame 위치를 추적합니다. 다시 열리거나
 * `style`이 바뀌면 이전 측정 결과를 버리고 숨긴 뒤 다시 측정합니다. 따라서 `positioned` 같은 상태로
 * Content의 `style`을 바꾸지 말고, 표시 전환은 Positioner나 바깥 요소에 적용하세요. `className`은
 * 다시 측정하는 기준으로 쓰지 않습니다. 가용 너비보다 넓으면 너비를 제한하고 다시 측정합니다.
 * 닫힌 뒤 `finishClose`가 호출되지 않으면 200ms 뒤 정리합니다.
 */
export const PopoverContent = React.forwardRef<unknown, PopoverContentProps>((props, ref) => {
  const { children, className, style, bindlayoutchange, ...nativeProps } = props;
  const api = usePopoverContext();
  const {
    open,
    mounted,
    openEpoch,
    positionRevision,
    isOpenRef,
    openEpochRef,
    positionRevisionRef,
    anchorRef,
    triggerRef,
    layerRef,
    arrowRef,
    placement,
    gutter,
    overflowPadding,
    arrowPadding,
    flip,
    setPosition,
    resetPosition,
    finishClose: finishPopoverClose,
  } = api;
  const measurementVersionRef = React.useRef(0);
  const intrinsicWidthRef = React.useRef<number | null>(null);
  const measurementConfigRef = React.useRef(0);
  const configuredStyleRef = React.useRef(style);
  const contentNodeRef = React.useRef<NodesRef | null>(null);
  const [measurementRevision, setMeasurementRevision] = React.useState(0);
  const [intrinsicSize, setIntrinsicSize] = React.useState<{
    width: number;
    height: number;
    epoch: number;
    config: number;
  } | null>(null);
  const [widthConstraint, setWidthConstraint] = React.useState<number | null>(null);
  const closeFinishedRef = React.useRef(false);
  const finishClose = React.useCallback(() => {
    "background only";
    if (closeFinishedRef.current) return;
    closeFinishedRef.current = true;
    finishPopoverClose();
  }, [finishPopoverClose]);

  const measureIntrinsicSize = React.useCallback(async () => {
    "background only";
    const contentNode = contentNodeRef.current;
    const config = measurementConfigRef.current;
    if (!open || !contentNode) return;
    const version = ++measurementVersionRef.current;
    try {
      const rect = await getRectByRef({ current: contentNode }, true);
      if (
        version !== measurementVersionRef.current ||
        !isOpenRef.current ||
        openEpoch !== openEpochRef.current ||
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
  }, [isOpenRef, open, openEpoch, openEpochRef]);

  const measurePosition = React.useCallback(async () => {
    "background only";
    const referenceNode = anchorRef.current ?? triggerRef.current;
    const layerNode = layerRef.current;
    const currentPositionRevision = positionRevisionRef.current;
    if (
      !open ||
      !referenceNode ||
      !intrinsicSize ||
      intrinsicSize.epoch !== openEpoch ||
      intrinsicSize.config !== measurementConfigRef.current
    ) {
      return;
    }
    const version = ++measurementVersionRef.current;
    const isCurrent = () =>
      version === measurementVersionRef.current &&
      isOpenRef.current &&
      openEpoch === openEpochRef.current &&
      currentPositionRevision === positionRevisionRef.current;
    try {
      const [reference, boundary, layer] = await Promise.all([
        getRectByRef({ current: referenceNode }, true),
        getRootRect(),
        layerNode ? getRectByRef({ current: layerNode }, true) : null,
      ]);
      if (!isCurrent()) return;
      const width = widthConstraint ?? intrinsicWidthRef.current ?? intrinsicSize.width;
      const arrow = arrowRef.current;
      const nextPosition = await computePosition({
        reference,
        boundary,
        width,
        height: intrinsicSize.height,
        placement,
        gutter,
        overflowPadding,
        flip: flip === false ? false : flip === true ? { fallbackStrategy: "bestFit" } : flip,
        shift: { crossAxis: true, limit: true },
        arrow: arrow ? { ...arrow, padding: arrowPadding } : undefined,
      });
      if (!isCurrent()) return;
      if (nextPosition.availableWidth < width) {
        const constrainedWidth = nextPosition.availableWidth;
        if (widthConstraint !== constrainedWidth) {
          setWidthConstraint(constrainedWidth);
          setIntrinsicSize(null);
          resetPosition();
          setMeasurementRevision((current) => current + 1);
        }
        return;
      }
      setPosition(nextPosition, reference, boundary, layer);
    } catch {
      // A native ref can disappear while an async selector query is in flight.
      // The current epoch stays unpositioned and therefore hidden.
    }
  }, [
    anchorRef,
    arrowPadding,
    arrowRef,
    flip,
    gutter,
    intrinsicSize,
    isOpenRef,
    layerRef,
    open,
    openEpoch,
    openEpochRef,
    overflowPadding,
    placement,
    positionRevisionRef,
    resetPosition,
    setPosition,
    triggerRef,
    widthConstraint,
  ]);

  React.useEffect(() => {
    "background only";
    measurementVersionRef.current += 1;
    intrinsicWidthRef.current = null;
    setWidthConstraint(null);
    setIntrinsicSize(null);
    resetPosition();
  }, [openEpoch, resetPosition]);
  React.useEffect(() => {
    "background only";
    if (areStylesEqual(configuredStyleRef.current, style)) return;
    measurementVersionRef.current += 1;
    intrinsicWidthRef.current = null;
    measurementConfigRef.current += 1;
    configuredStyleRef.current = style;
    setWidthConstraint(null);
    setIntrinsicSize(null);
    resetPosition();
    setMeasurementRevision((current) => current + 1);
  }, [resetPosition, style]);
  React.useEffect(() => {
    "background only";
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      "background only";
      void measureIntrinsicSize();
    });
    return () => cancelAnimationFrame(frame);
  }, [open, openEpoch, measureIntrinsicSize, measurementRevision]);
  React.useEffect(() => {
    "background only";
    if (!open) return;
    let disposed = false;
    let frame: number | undefined;
    const trackPosition = () => {
      void measurePosition().finally(() => {
        if (!disposed && isOpenRef.current) {
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
  }, [isOpenRef, open, openEpoch, positionRevision, measurePosition]);
  React.useEffect(() => {
    "background only";
    if (open) {
      closeFinishedRef.current = false;
      return;
    }
    if (!mounted) return;
    const timer = setTimeout(() => {
      "background only";
      finishClose();
    }, EXIT_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [mounted, open, finishClose]);

  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      // ReactLynx가 같은 요소의 ref를 다시 적용할 수 있어, 요소가 붙거나 떨어질 때만 측정을 무효화합니다.
      if ((node === null) !== (contentNodeRef.current === null)) {
        measurementVersionRef.current += 1;
      }
      contentNodeRef.current = node;
      assignNodeRef(ref, node);
    },
    [ref],
  );
  const handleLayoutChange = React.useCallback<LayoutHandler>(
    (event) => {
      "background only";
      const nextSize = getLayoutSize(event);
      if (nextSize && open) {
        measurementVersionRef.current += 1;
        if (intrinsicWidthRef.current === null) intrinsicWidthRef.current = nextSize.width;
        setIntrinsicSize((current) => {
          const width = intrinsicWidthRef.current ?? nextSize.width;
          if (
            current?.width === width &&
            current.height === nextSize.height &&
            current.epoch === openEpoch &&
            current.config === measurementConfigRef.current
          ) {
            return current;
          }
          return {
            width,
            height: nextSize.height,
            epoch: openEpoch,
            config: measurementConfigRef.current,
          };
        });
      }
      bindlayoutchange?.(event);
    },
    [bindlayoutchange, open, openEpoch],
  );

  return (
    <view
      ref={handleRef as ViewProps["ref"]}
      className={className}
      style={{
        ...style,
        ...(widthConstraint != null ? { width: toPixel(widthConstraint) } : {}),
      }}
      bindlayoutchange={handleLayoutChange}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
PopoverContent.displayName = "PopoverContent";

////////////////////////////////////////////////////////////////////////////////////
// Arrow
////////////////////////////////////////////////////////////////////////////////////

export interface PopoverArrowProps extends StyledViewProps {
  /** 회전하는 정사각형 화살표 컨테이너의 한 변(px)입니다. 위치 계산에 씁니다. */
  size: number;
  /** 콘텐츠 가장자리에서 화살표 끝이 튀어나온 길이(px)입니다. `gutter`에 더합니다. */
  tipHeight: number;
}

/**
 * Content 안에서 기준 요소를 가리키는 화살표 native `<view>`입니다. 계산된 방향의 반대쪽 가장자리에
 * `position: absolute`로 붙입니다. 방향에 맞춘 회전은 `usePopoverContext().side`로 직접 적용합니다.
 * 렌더링하는 동안 `size`·`tipHeight`를 위치 계산에 반영합니다.
 */
export const PopoverArrow = React.forwardRef<unknown, PopoverArrowProps>((props, ref) => {
  const { children, style, size, tipHeight, ...nativeProps } = props;
  const { position, side, arrowRef, requestPositionUpdate } = usePopoverContext();

  React.useEffect(() => {
    "background only";
    arrowRef.current = { size, tipHeight };
    requestPositionUpdate();
    return () => {
      arrowRef.current = null;
      requestPositionUpdate();
    };
  }, [arrowRef, requestPositionUpdate, size, tipHeight]);

  const arrow = position?.arrow;
  const crossLeft = toPixel(arrow?.left ?? 0);
  const crossTop = toPixel(arrow?.top ?? 0);
  // 방향이 바뀔 때 이전 방향의 offset이 남지 않도록 네 offset을 항상 모두 지정합니다.
  const geometryStyle =
    side === "top"
      ? { left: crossLeft, top: "100%", right: "auto", bottom: "auto" }
      : side === "bottom"
        ? { left: crossLeft, top: "auto", right: "auto", bottom: "100%" }
        : side === "right"
          ? { left: "auto", top: crossTop, right: "100%", bottom: "auto" }
          : { left: "100%", top: crossTop, right: "auto", bottom: "auto" };

  return (
    <view
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      {...nativeProps}
      style={{ position: "absolute", ...geometryStyle, ...style }}
    >
      {children}
    </view>
  );
});
PopoverArrow.displayName = "PopoverArrow";

////////////////////////////////////////////////////////////////////////////////////
// CloseButton
////////////////////////////////////////////////////////////////////////////////////

export interface PopoverCloseButtonProps
  extends UsePopoverCloseButtonProps,
    Omit<ViewProps, keyof UsePopoverCloseButtonProps> {}

/**
 * 탭하면 Popover를 닫는 native `<view>`입니다. 사용자 `bindtap`을 먼저 실행합니다.
 * `accessibility-label`을 지정하세요.
 */
export const PopoverCloseButton = React.forwardRef<unknown, PopoverCloseButtonProps>(
  (props, ref) => {
    const {
      children,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "main-thread:bindtouchstart": mainThreadBindtouchstart,
      "main-thread:bindtouchend": mainThreadBindtouchend,
      "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = props;
    const { closeButtonProps } = usePopoverCloseButton({
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "main-thread:bindtouchstart": mainThreadBindtouchstart,
      "main-thread:bindtouchend": mainThreadBindtouchend,
      "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
    });

    return (
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        {...nativeProps}
        {...closeButtonProps}
      >
        {children}
      </view>
    );
  },
);
PopoverCloseButton.displayName = "PopoverCloseButton";

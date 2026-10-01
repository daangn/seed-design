import * as React from "@lynx-js/react";
import { getRectByRef } from "@lynx-js/lynx-ui-common";
import { OverlayView, type OverlayViewProps } from "@lynx-js/lynx-ui-overlay";
import type {
  BaseEvent,
  CSSProperties,
  IntrinsicElements,
  NodesRef,
  OverlayProps,
} from "@lynx-js/types";
import { computePosition } from "@seed-design/lynx-react-floating";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";

import { useMenu, type UseMenuProps } from "./useMenu.js";
import { MenuProvider, useMenuContext } from "./useMenuContext.js";
import { useMenuItem, type UseMenuItemProps } from "./useMenuItem.js";
import { MenuItemProvider } from "./useMenuItemContext.js";

type ViewProps = IntrinsicElements["view"];
type TextProps = IntrinsicElements["text"];
/** 위치 style을 합치는 파트는 객체 style만 받습니다. */
type StyledViewProps = Omit<ViewProps, "style"> & { style?: CSSProperties };
type TapHandler = NonNullable<ViewProps["bindtap"]>;
type LayoutHandler = NonNullable<ViewProps["bindlayoutchange"]>;
type OverlayEventProps = Pick<
  OverlayProps,
  "bindshowoverlay" | "binddismissoverlay" | "bindrequestclose"
>;

/** 닫힘 전환이 끝났다는 신호가 없을 때 Positioner를 unmount하기까지 기다리는 시간입니다. */
const EXIT_FALLBACK_MS = 200;
/** 공간이 부족해도 콘텐츠에 남기는 최소 높이(px)입니다. React Menu와 같습니다. */
const MINIMUM_HEIGHT = 200;
const BACKDROP_STYLE: CSSProperties = {
  position: "absolute",
  top: "0px",
  right: "0px",
  bottom: "0px",
  left: "0px",
};
const FILL_STYLE: CSSProperties = { width: "100%", height: "100%" };

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

export interface MenuRootProps extends UseMenuProps {
  children?: React.ReactNode;
}

/**
 * @platform Lynx
 *
 * `useMenu` 결과를 하위 파트에 전달합니다. native 요소를 렌더링하지 않습니다. Lynx에는 DOM focus,
 * 키보드 탐색, typeahead, `asChild`, 중첩 submenu가 없습니다.
 */
export function MenuRoot(props: MenuRootProps): React.ReactElement {
  const { children, ...menuProps } = props;
  const api = useMenu(menuProps);
  return <MenuProvider value={api}>{children}</MenuProvider>;
}
MenuRoot.displayName = "MenuRoot";

////////////////////////////////////////////////////////////////////////////////////
// Anchor / Trigger
////////////////////////////////////////////////////////////////////////////////////

export interface MenuAnchorProps extends ViewProps {}

/**
 * 위치 기준점 native `<view>`입니다. 탭으로 열고 닫지 않고 접근성 기본값도 두지 않습니다.
 * Trigger와 함께 있으면 Anchor를 기준으로 배치합니다.
 */
export const MenuAnchor = React.forwardRef<unknown, MenuAnchorProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  const { anchorRef } = useMenuContext();
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      anchorRef.current = node;
      assignNodeRef(ref, node);
    },
    [anchorRef, ref],
  );

  return (
    <view ref={handleRef as ViewProps["ref"]} {...nativeProps}>
      {children}
    </view>
  );
});
MenuAnchor.displayName = "MenuAnchor";

export interface MenuTriggerProps extends ViewProps {
  /** `true`이거나 Root가 `disabled`이면 탭해도 열지 않습니다. */
  disabled?: boolean;
}

/**
 * 탭하면 메뉴를 열고 닫는 native `<view>`입니다. 열림 상태를 `accessibility-value`의
 * `"expanded"`·`"collapsed"`로 알리고 `accessibility-traits="button"`을 기본값으로 둡니다.
 * 사용자 `bindtap`은 열림 상태를 바꾼 뒤 실행합니다.
 */
export const MenuTrigger = React.forwardRef<unknown, MenuTriggerProps>((props, ref) => {
  const {
    children,
    bindtap,
    disabled: disabledProp = false,
    "main-thread:bindtap": mainThreadOnTap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const {
    open,
    disabled: menuDisabled,
    setOpen,
    triggerRef,
    setTriggerHandlers,
  } = useMenuContext();
  const disabled = menuDisabled || disabledProp;
  const handleTap = React.useCallback<TapHandler>(
    (event, instance) => {
      "background only";
      setOpen(!open, { reason: "trigger", event });
      bindtap?.(event, instance);
    },
    [bindtap, open, setOpen],
  );
  const {
    pressed: _pressed,
    bindtap: proxyBindtap,
    ...pressHandlers
  } = usePressTap({
    disabled,
    onTap: handleTap,
    mainThreadOnTap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });
  const mainThreadProxyBindtap = pressHandlers["main-thread:bindtap"];
  React.useEffect(() => {
    "background only";
    setTriggerHandlers(
      mainThreadProxyBindtap
        ? { bindtap: proxyBindtap, "main-thread:bindtap": mainThreadProxyBindtap }
        : { bindtap: proxyBindtap },
    );
    return () => setTriggerHandlers({});
  }, [setTriggerHandlers, mainThreadProxyBindtap, proxyBindtap]);
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      triggerRef.current = node;
      assignNodeRef(ref, node);
    },
    [triggerRef, ref],
  );

  return (
    <view
      ref={handleRef as ViewProps["ref"]}
      accessibility-element={accessibilityElement}
      accessibility-label={accessibilityLabel}
      accessibility-role-description="button"
      accessibility-value={open ? "expanded" : "collapsed"}
      accessibility-traits={disabled ? "disabled" : (accessibilityTraits ?? "button")}
      {...nativeProps}
      {...pressHandlers}
      bindtap={proxyBindtap}
    >
      {children}
    </view>
  );
});
MenuTrigger.displayName = "MenuTrigger";

////////////////////////////////////////////////////////////////////////////////////
// Positioner
////////////////////////////////////////////////////////////////////////////////////

export interface MenuPositionerProps
  extends Pick<OverlayViewProps, "container" | "overlayLevel" | "overlayViewProps"> {
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * 열려 있거나 닫힘 전환 중일 때 화면 전체를 덮는 레이어입니다. lynx-ui `OverlayView`를 사용합니다.
 * 레이어 안에 backdrop과 Trigger 위치의 탭 영역을 두고, 그 위에 `MenuContent`를 배치합니다.
 *
 * - `container`가 없으면 `position: fixed`인 native `<view>`가 레이어입니다. Lynx view 안에만 그려지며,
 *   다른 요소와의 순서는 `className`·`style`의 z-index로 정합니다.
 * - `container`를 지정하면 Lynx view 밖까지 덮는 native `<overlay>`에 렌더링합니다. backdrop이 탭을
 *   받도록 `overlayViewProps`의 `"event-through"` 기본값을 `false`로 둡니다. native overlay의 닫힘
 *   요청(Android 뒤로 가기)은 `"dismiss"` reason으로 닫습니다.
 *
 * backdrop을 탭하면 `"interactOutside"`, Trigger 위치를 탭하면 `"trigger"` reason으로 닫습니다.
 */
export const MenuPositioner = React.forwardRef<unknown, MenuPositionerProps>((props, ref) => {
  const { children, className, style, container, overlayLevel, overlayViewProps } = props;
  const { mounted, setOpen, finishClose, layerRef, layerRect, triggerRect, triggerHandlers } =
    useMenuContext();
  // iOS는 overlayLevel을 지정해 mount하면 표시 전에 binddismissoverlay를 한 번 보냅니다. 표시된 뒤의
  // 닫힘만 "dismiss"로 처리합니다. OverlayView처럼 mount 때의 overlayLevel을 기준으로 삼습니다.
  const shownRef = React.useRef(overlayLevel === undefined);
  const handleLayerRef = React.useCallback(
    (node: NodesRef | null) => {
      layerRef.current = node;
      assignNodeRef(ref, node);
    },
    [layerRef, ref],
  );
  const handleBackdropTap = React.useCallback<TapHandler>(
    (event) => {
      "background only";
      setOpen(false, { reason: "interactOutside", event });
    },
    [setOpen],
  );
  const handleShowOverlay = React.useCallback(() => {
    "background only";
    shownRef.current = true;
  }, []);
  const handleDismissOverlay = React.useCallback(
    (event: BaseEvent) => {
      "background only";
      if (!shownRef.current) return;
      setOpen(false, { reason: "dismiss", event });
      finishClose(true);
    },
    [finishClose, setOpen],
  );
  const handleRequestClose = React.useCallback(
    (event: BaseEvent) => {
      "background only";
      setOpen(false, { reason: "dismiss", event });
    },
    [setOpen],
  );

  if (!mounted) return null;

  const triggerProxyStyle: CSSProperties | null =
    triggerRect && layerRect
      ? {
          position: "absolute",
          left: toPixel(triggerRect.left - layerRect.left),
          top: toPixel(triggerRect.top - layerRect.top),
          width: toPixel(triggerRect.width),
          height: toPixel(triggerRect.height),
        }
      : null;

  // 바깥 탭을 아래 화면에 넘기지 않고 backdrop에서 받도록 overlay 레이어의 event-through 기본값을 끕니다.
  const overlayLayerProps: ViewProps & OverlayEventProps = {
    "event-through": false,
    ...overlayViewProps,
    bindshowoverlay: handleShowOverlay,
    binddismissoverlay: handleDismissOverlay,
    bindrequestclose: handleRequestClose,
  };

  return (
    <OverlayView
      container={container}
      overlayLevel={overlayLevel}
      overlayViewProps={container ? overlayLayerProps : overlayViewProps}
      className={className}
      style={{
        position: container ? "relative" : "fixed",
        left: "0px",
        top: "0px",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <view ref={handleLayerRef as ViewProps["ref"]} style={FILL_STYLE}>
        <view style={BACKDROP_STYLE} bindtap={handleBackdropTap} />
        {triggerProxyStyle && <view style={triggerProxyStyle} {...triggerHandlers} />}
        {children}
      </view>
    </OverlayView>
  );
});
MenuPositioner.displayName = "MenuPositioner";

////////////////////////////////////////////////////////////////////////////////////
// Content
////////////////////////////////////////////////////////////////////////////////////

export interface MenuContentProps extends StyledViewProps {}

/**
 * 크기를 측정해 위치를 계산하는 콘텐츠 native `<view>`입니다. `MenuPositioner` 안에 둡니다.
 *
 * 열리면 자신의 layout 크기와 기준 요소, Lynx root 경계, 레이어를 측정해 위치를 계산합니다. 계산을 마치기
 * 전에는 `visibility: hidden`으로 숨기고, 계산한 높이를 `maxHeight`로 적용합니다. 긴 목록을 스크롤하려면
 * 자식에 `scroll-view`를 두세요. 다시 열리거나 `style`이 바뀌면 이전 측정 결과를 버리고 다시 측정합니다.
 * 가용 너비보다 넓으면 너비를 제한하고 다시 측정합니다. 닫힌 뒤 `finishClose`가 호출되지 않으면 200ms
 * 뒤 정리합니다.
 */
export const MenuContent = React.forwardRef<unknown, MenuContentProps>((props, ref) => {
  const { children, style, bindlayoutchange, ...nativeProps } = props;
  const {
    open,
    mounted,
    positioned,
    position,
    layerRect,
    openEpoch,
    isOpenRef,
    openEpochRef,
    anchorRef,
    triggerRef,
    layerRef,
    placement,
    gutter,
    overflowPadding,
    matchReferenceWidth,
    setPosition,
    resetPosition,
    finishClose,
  } = useMenuContext();
  const measurementVersionRef = React.useRef(0);
  const intrinsicWidthRef = React.useRef<number | null>(null);
  const measurementConfigRef = React.useRef(0);
  const configuredStyleRef = React.useRef(style);
  const contentNodeRef = React.useRef<NodesRef | null>(null);
  const [intrinsicSize, setIntrinsicSize] = React.useState<{
    width: number;
    height: number;
    epoch: number;
    config: number;
  } | null>(null);
  const [widthConstraint, setWidthConstraint] = React.useState<number | null>(null);
  // 위치 계산으로 적용한 높이 제한입니다. 이 제한에 걸린 layout 높이는 콘텐츠 원래 높이로 쓰지 않습니다.
  const appliedMaxHeight = positioned && position ? position.height : null;

  const measurePosition = React.useCallback(async () => {
    "background only";
    const referenceNode = anchorRef.current ?? triggerRef.current;
    const triggerNode = triggerRef.current;
    const layerNode = layerRef.current;
    if (
      !open ||
      !referenceNode ||
      !layerNode ||
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
      openEpoch === openEpochRef.current;
    try {
      const [reference, boundary, layer, trigger] = await Promise.all([
        getRectByRef({ current: referenceNode }, true),
        getRootRect(),
        getRectByRef({ current: layerNode }, true),
        triggerNode ? getRectByRef({ current: triggerNode }, true) : null,
      ]);
      if (!isCurrent()) return;
      const intrinsicWidth = matchReferenceWidth
        ? reference.width
        : (intrinsicWidthRef.current ?? intrinsicSize.width);
      const width = widthConstraint ?? intrinsicWidth;
      const nextPosition = await computePosition({
        reference,
        boundary,
        width,
        height: intrinsicSize.height,
        placement,
        gutter,
        overflowPadding,
        flip: { fallbackStrategy: "bestFit" },
        shift: { crossAxis: true },
        size: { order: "beforeFlip", minimumHeight: MINIMUM_HEIGHT },
      });
      if (!isCurrent()) return;
      if (nextPosition.availableWidth < width) {
        // 너비를 제한한 뒤 bindlayoutchange에서 줄바꿈된 높이를 다시 측정합니다.
        const constrainedWidth = nextPosition.availableWidth;
        if (widthConstraint !== constrainedWidth) {
          setWidthConstraint(constrainedWidth);
          setIntrinsicSize(null);
          resetPosition();
        }
        return;
      }
      setPosition(nextPosition, layer, trigger);
    } catch {
      // A native ref can disappear while an async selector query is in flight.
      // The current epoch stays unpositioned and therefore hidden.
    }
  }, [
    anchorRef,
    gutter,
    intrinsicSize,
    isOpenRef,
    layerRef,
    matchReferenceWidth,
    open,
    openEpoch,
    openEpochRef,
    overflowPadding,
    placement,
    resetPosition,
    setPosition,
    triggerRef,
    widthConstraint,
  ]);

  React.useEffect(() => {
    "background only";
    measurementVersionRef.current += 1;
    setWidthConstraint(null);
    resetPosition();
    // 닫힘 전환 중에 다시 열면 layout이 바뀌지 않아 bindlayoutchange가 오지 않으므로 이전 크기를 이어 씁니다.
    setIntrinsicSize((current) => (current ? { ...current, epoch: openEpoch } : current));
  }, [openEpoch, resetPosition]);
  React.useEffect(() => {
    "background only";
    if (areStylesEqual(configuredStyleRef.current, style)) return;
    configuredStyleRef.current = style;
    measurementVersionRef.current += 1;
    intrinsicWidthRef.current = null;
    measurementConfigRef.current += 1;
    setWidthConstraint(null);
    setIntrinsicSize((current) =>
      current ? { ...current, config: measurementConfigRef.current } : current,
    );
    resetPosition();
  }, [resetPosition, style]);
  React.useEffect(() => {
    "background only";
    if (open) void measurePosition();
  }, [open, measurePosition]);
  React.useEffect(() => {
    "background only";
    if (open || !mounted) return;
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
        if (intrinsicWidthRef.current === null) intrinsicWidthRef.current = nextSize.width;
        setIntrinsicSize((current) => {
          const width = intrinsicWidthRef.current ?? nextSize.width;
          const clamped =
            appliedMaxHeight !== null &&
            current !== null &&
            nextSize.height >= appliedMaxHeight &&
            current.height >= nextSize.height;
          const height = clamped ? current.height : nextSize.height;
          if (
            current?.width === width &&
            current.height === height &&
            current.epoch === openEpoch &&
            current.config === measurementConfigRef.current
          ) {
            return current;
          }
          return { width, height, epoch: openEpoch, config: measurementConfigRef.current };
        });
      }
      bindlayoutchange?.(event);
    },
    [appliedMaxHeight, bindlayoutchange, open, openEpoch],
  );

  const placed = positioned && position !== null && layerRect !== null;

  return (
    <view
      ref={handleRef as ViewProps["ref"]}
      style={{
        position: "absolute",
        left: toPixel(placed ? position.left - layerRect.left : 0),
        top: toPixel(placed ? position.top - layerRect.top : 0),
        maxHeight: placed ? toPixel(position.height) : "100%",
        visibility: placed ? "visible" : "hidden",
        transformOrigin: placed ? position.transformOrigin : "center",
        ...(placed ? { width: toPixel(position.width) } : {}),
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
MenuContent.displayName = "MenuContent";

////////////////////////////////////////////////////////////////////////////////////
// Group
////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupProps extends ViewProps {}

/** 항목을 묶는 native `<view>`입니다. */
export const MenuGroup = React.forwardRef<unknown, MenuGroupProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
      {children}
    </view>
  );
});
MenuGroup.displayName = "MenuGroup";

export interface MenuGroupLabelProps extends TextProps {}

/** 그룹 제목 native `<text>`입니다. `accessibility-heading`을 기본값으로 둡니다. */
export const MenuGroupLabel = React.forwardRef<unknown, MenuGroupLabelProps>((props, ref) => {
  const { children, "accessibility-heading": accessibilityHeading = true, ...nativeProps } = props;
  return (
    <text
      {...(ref ? { ref: ref as TextProps["ref"] } : {})}
      accessibility-heading={accessibilityHeading}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
MenuGroupLabel.displayName = "MenuGroupLabel";

////////////////////////////////////////////////////////////////////////////////////
// Item
////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemProps extends UseMenuItemProps, Omit<ViewProps, keyof UseMenuItemProps> {}

/**
 * 메뉴 항목 native `<view>`입니다. 활성 항목을 탭하면 사용자 `bindtap`을 먼저 실행한 뒤 메뉴를 닫습니다.
 * 하위 요소는 `useMenuItemContext`로 `disabled`·`pressed`를 읽습니다.
 */
export const MenuItem = React.forwardRef<unknown, MenuItemProps>((props, ref) => {
  const {
    children,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    ...nativeProps
  } = props;
  const api = useMenuItem({
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
  });
  const {
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
  } = api.rootProps;

  return (
    <MenuItemProvider value={api}>
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        {...nativeProps}
        {...api.rootProps}
        bindtouchstart={(event) => {
          bindtouchstart?.(event);
          pressStart(event);
        }}
        bindtouchend={(event) => {
          bindtouchend?.(event);
          pressEnd(event);
        }}
        bindtouchcancel={(event) => {
          bindtouchcancel?.(event);
          pressCancel(event);
        }}
      >
        {children}
      </view>
    </MenuItemProvider>
  );
});
MenuItem.displayName = "MenuItem";

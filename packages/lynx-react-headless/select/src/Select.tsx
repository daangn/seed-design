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

import { useSelect, type UseSelectProps } from "./useSelect.js";
import { SelectProvider, useSelectContext } from "./useSelectContext.js";
import { useSelectItem, type UseSelectItemProps } from "./useSelectItem.js";
import { SelectItemProvider } from "./useSelectItemContext.js";
import {
  SelectScrollAreaContext,
  useSelectScrollArea,
  type SelectScrollAreaBinding,
} from "./useSelectScrollArea.js";
import { useSelectTrigger, type UseSelectTriggerProps } from "./useSelectTrigger.js";

type ViewProps = IntrinsicElements["view"];
type TextProps = IntrinsicElements["text"];
type ScrollViewProps = IntrinsicElements["scroll-view"];
/** 위치 style을 합치는 파트는 객체 style만 받습니다. */
type StyledViewProps = Omit<ViewProps, "style"> & { style?: CSSProperties };
type TapHandler = NonNullable<ViewProps["bindtap"]>;
type LayoutHandler = NonNullable<ViewProps["bindlayoutchange"]>;
type OverlayEventProps = Pick<
  OverlayProps,
  "bindshowoverlay" | "binddismissoverlay" | "bindrequestclose"
>;

/** 닫힘 전환이 끝났다는 신호가 없을 때 Positioner를 숨기기까지 기다리는 시간입니다. */
const EXIT_FALLBACK_MS = 200;
/** 화면 가장자리에서 배치를 정할 때 확보하려는 최소 가용 높이(px)입니다. 목록 최소 높이는 아닙니다. */
const MINIMUM_AVAILABLE_HEIGHT = 200;
const BACKDROP_STYLE: CSSProperties = {
  position: "absolute",
  top: "0px",
  right: "0px",
  bottom: "0px",
  left: "0px",
};
const FILL_STYLE: CSSProperties = { width: "100%", height: "100%" };
let nextScrollAreaId = 0;

function toPixel(value: number) {
  return `${value}px`;
}

function assignNodeRef(ref: React.ForwardedRef<unknown>, node: NodesRef | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

/** 사용자 touch handler를 먼저 실행한 뒤 눌림 상태를 갱신합니다. 사용자 handler가 없으면 그대로 씁니다. */
function withPressTouch<E>(
  handler: ((event: E) => void) | undefined,
  press: (event: E) => void,
): (event: E) => void {
  if (!handler) return press;
  return (event) => {
    handler(event);
    press(event);
  };
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
// Root
////////////////////////////////////////////////////////////////////////////////////

export interface SelectRootProps extends UseSelectProps {
  children?: React.ReactNode;
}

/**
 * @platform Lynx
 *
 * `useSelect` 결과를 하위 파트에 전달합니다. native 요소를 렌더링하지 않습니다. Lynx에는 DOM focus,
 * 키보드 탐색, typeahead, hidden native select와 form 제출, ARIA id, `asChild`가 없습니다.
 */
export function SelectRoot(props: SelectRootProps): React.ReactElement {
  const { children, ...selectProps } = props;
  const api = useSelect(selectProps);
  return <SelectProvider value={api}>{children}</SelectProvider>;
}
SelectRoot.displayName = "SelectRoot";

////////////////////////////////////////////////////////////////////////////////////
// Trigger / Value / Placeholder
////////////////////////////////////////////////////////////////////////////////////

export interface SelectTriggerProps
  extends Omit<UseSelectTriggerProps, "ref">,
    Omit<ViewProps, keyof UseSelectTriggerProps> {}

/**
 * 탭하면 목록을 열고 닫는 native `<view>`입니다. 위치 계산의 기준 요소입니다. `useSelectTrigger`를 사용합니다.
 */
export const SelectTrigger = React.forwardRef<unknown, SelectTriggerProps>((props, ref) => {
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
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    ...nativeProps
  } = props;
  const { rootRef, rootProps } = useSelectTrigger({
    ref,
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
      ref={rootRef as ViewProps["ref"]}
      {...nativeProps}
      {...rootProps}
      bindtouchstart={withPressTouch(bindtouchstart, rootProps.bindtouchstart)}
      bindtouchend={withPressTouch(bindtouchend, rootProps.bindtouchend)}
      bindtouchcancel={withPressTouch(bindtouchcancel, rootProps.bindtouchcancel)}
    >
      {children}
    </view>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps extends Omit<TextProps, "children"> {
  children?: React.ReactNode;
}

/**
 * 선택한 값을 표시합니다. `showPlaceholder`이면 렌더링하지 않습니다. `children`이 없으면 `displayValue`를
 * 표시하며, 문자열·숫자는 native `<text>`, 그 밖의 노드는 native `<view>`로 감쌉니다.
 */
export const SelectValue = React.forwardRef<unknown, SelectValueProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  const { showPlaceholder, displayValue } = useSelectContext();
  if (showPlaceholder) return null;
  const content = children ?? displayValue;
  if (typeof content === "string" || typeof content === "number") {
    return (
      <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
        {content}
      </text>
    );
  }
  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...(nativeProps as ViewProps)}>
      {content}
    </view>
  );
});
SelectValue.displayName = "SelectValue";

export interface SelectPlaceholderProps extends Omit<TextProps, "children"> {
  children?: React.ReactNode;
}

/**
 * 값이 없거나 선택한 값의 항목을 찾지 못했을 때 `children`을 표시합니다. 문자열·숫자는 native `<text>`,
 * 그 밖의 노드는 native `<view>`로 감쌉니다.
 */
export const SelectPlaceholder = React.forwardRef<unknown, SelectPlaceholderProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  const { showPlaceholder } = useSelectContext();
  if (!showPlaceholder) return null;
  if (typeof children === "string" || typeof children === "number") {
    return (
      <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
        {children}
      </text>
    );
  }
  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...(nativeProps as ViewProps)}>
      {children}
    </view>
  );
});
SelectPlaceholder.displayName = "SelectPlaceholder";

////////////////////////////////////////////////////////////////////////////////////
// Positioner
////////////////////////////////////////////////////////////////////////////////////

export interface SelectPositionerProps
  extends Pick<OverlayViewProps, "container" | "overlayLevel" | "overlayViewProps"> {
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * 화면 전체를 덮는 목록 레이어입니다. lynx-ui `OverlayView`를 사용합니다. 레이어 안에 backdrop과 Trigger
 * 위치의 탭 영역을 두고, 그 위에 `SelectContent`를 배치합니다.
 *
 * 닫힌 동안에도 mount해 두어 항목이 등록되고 `defaultValue`의 label·icon을 열기 전에 해석합니다. 숨기는 방법은
 * 모드마다 다릅니다.
 *
 * - `container`가 없으면 `position: fixed`인 native `<view>`가 레이어입니다. Lynx view 안에만 그려지며,
 *   다른 요소와의 순서는 `className`·`style`의 z-index로 정합니다. 닫힌 동안 `display: none`으로 숨깁니다.
 *   `"dismiss"` reason은 없고, Android 뒤로 가기는 host 화면을 닫습니다.
 * - `container`를 지정하면 Lynx view 밖까지 덮는 native `<overlay>`에 렌더링합니다. 닫힌 동안
 *   `overlayViewProps`의 `visible`을 `false`로 둡니다. backdrop이 탭을 받도록 `"event-through"` 기본값을
 *   `false`로 둡니다. native overlay의 닫힘 요청(Android 뒤로 가기)은 `"dismiss"` reason으로 닫습니다.
 *   `overlayLevel`은 처음 mount할 때의 값만 씁니다.
 *
 * backdrop을 탭하면 `"interactOutside"`, Trigger 위치를 탭하면 `"trigger"` reason으로 닫습니다.
 */
export const SelectPositioner = React.forwardRef<unknown, SelectPositionerProps>((props, ref) => {
  const { children, className, style, container, overlayLevel, overlayViewProps } = props;
  const { mounted, setOpen, finishClose, layerRef, layerRect, triggerRect, triggerHandlers } =
    useSelectContext();
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
      // Select가 닫힌 뒤 visible을 false로 바꿀 때도 오지만, 이미 닫혀 있어 setOpen이 무시합니다.
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
  // visible을 열 때 넘기면 overlayLevel의 지연 표시를 덮어쓰므로 닫혔을 때만 넘깁니다.
  const overlayLayerProps: ViewProps & OverlayEventProps & { visible?: boolean } = {
    "event-through": false,
    ...overlayViewProps,
    ...(mounted ? {} : { visible: false }),
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
        // view 모드는 visible이 없어 display로 숨깁니다. iOS에서 숨긴 view의 text가 그려지지 않도록
        // overflow도 함께 바꿉니다. 지운 inline key는 이전 값이 남을 수 있어 항상 지정합니다.
        ...(container
          ? {}
          : { display: mounted ? "flex" : "none", overflow: mounted ? "visible" : "hidden" }),
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
SelectPositioner.displayName = "SelectPositioner";

////////////////////////////////////////////////////////////////////////////////////
// Content
////////////////////////////////////////////////////////////////////////////////////

export interface SelectContentProps extends StyledViewProps {
  /**
   * 목록 viewport의 최대 높이(px)입니다. 위치 계산과 스크롤 여부 판단에 씁니다. 생략하면 가용 높이까지
   * 늘어납니다.
   */
  maxHeight?: number;
}

/**
 * 크기를 측정해 위치를 계산하는 콘텐츠 native `<view>`입니다. `SelectPositioner` 안에 두고, 항목은
 * `SelectScrollArea`(또는 `useSelectScrollArea`로 연결한 viewport) 안에 둡니다.
 *
 * 열리면 목록 크기와 Trigger, Lynx root 경계, 레이어를 측정해 위치를 계산합니다. 너비는 Trigger 너비이며
 * 가용 너비보다 넓으면 제한하고 다시 측정합니다. 계산을 마치기 전에는 `visibility: hidden`으로 숨기고,
 * 늦게 끝난 측정은 버립니다. 다시 열리거나 `style`이 바뀌면 이전 측정 결과를 버리고 다시 측정합니다. 목록이
 * 계산한 높이보다 길면 선택 항목이 보이도록 필요한 만큼만 스크롤합니다. 닫힌 뒤 `finishClose`가 호출되지
 * 않으면 200ms 뒤 Positioner를 숨깁니다.
 */
export const SelectContent = React.forwardRef<unknown, SelectContentProps>((props, ref) => {
  const { children, style, maxHeight, ...nativeProps } = props;
  const {
    open,
    mounted,
    positioned,
    position,
    layerRect,
    openEpoch,
    isOpenRef,
    openEpochRef,
    triggerRef,
    layerRef,
    placement,
    gutter,
    overflowPadding,
    selectedItemNode,
    setPosition,
    resetPosition,
    finishClose,
  } = useSelectContext();
  const measurementVersionRef = React.useRef(0);
  const intrinsicMeasurementVersionRef = React.useRef(0);
  const scrollRequestVersionRef = React.useRef(0);
  const scrolledEpochRef = React.useRef<number | null>(null);
  const measurementConfigRef = React.useRef(0);
  const configuredStyleRef = React.useRef(style);
  const configuredMaxHeightRef = React.useRef(maxHeight);
  // ReactLynx는 같은 요소에도 ref를 새 node 객체로 다시 적용합니다. node는 ref에 두고, 처음 붙었다는 사실만
  // state로 바꿔 측정 effect를 시작합니다.
  const scrollNodeRef = React.useRef<NodesRef | null>(null);
  const scrollContentNodeRef = React.useRef<NodesRef | null>(null);
  const scrollAttachedRef = React.useRef(false);
  const scrollContentAttachedRef = React.useRef(false);
  const [scrollAttached, setScrollAttached] = React.useState(false);
  const [scrollContentAttached, setScrollContentAttached] = React.useState(false);
  const [scrollAreaId, setScrollAreaId] = React.useState<string | undefined>(undefined);
  const [intrinsicSize, setIntrinsicSize] = React.useState<{
    width: number;
    height: number;
    epoch: number;
    config: number;
  } | null>(null);
  const [widthConstraint, setWidthConstraint] = React.useState<number | null>(null);

  React.useEffect(() => {
    "background only";
    // Background thread에서 한 번 만들고 state로 공유합니다.
    setScrollAreaId(`seed-select-scroll-area-${nextScrollAreaId++}`);
  }, []);

  const measurePosition = React.useCallback(async () => {
    "background only";
    const referenceNode = triggerRef.current;
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
      const [reference, boundary, layer] = await Promise.all([
        getRectByRef({ current: referenceNode }, true),
        getRootRect(),
        getRectByRef({ current: layerNode }, true),
      ]);
      if (!isCurrent()) return;
      const width = widthConstraint ?? reference.width;
      const nextPosition = await computePosition({
        reference,
        boundary,
        width,
        height:
          maxHeight === undefined
            ? intrinsicSize.height
            : Math.min(intrinsicSize.height, maxHeight),
        placement,
        gutter,
        overflowPadding,
        flip: { fallbackStrategy: "bestFit" },
        shift: { crossAxis: true },
        size: { order: "beforeFlip", minimumHeight: MINIMUM_AVAILABLE_HEIGHT },
      });
      if (!isCurrent()) return;
      if (nextPosition.availableWidth < width) {
        // 너비를 제한하면 줄바꿈으로 높이가 바뀌므로 다시 측정합니다.
        const constrainedWidth = nextPosition.availableWidth;
        if (widthConstraint !== constrainedWidth) {
          measurementVersionRef.current++;
          measurementConfigRef.current++;
          intrinsicMeasurementVersionRef.current++;
          scrollRequestVersionRef.current++;
          setWidthConstraint(constrainedWidth);
          setIntrinsicSize(null);
          resetPosition();
        }
        return;
      }
      setPosition(nextPosition, layer, reference);
    } catch {
      // native node가 비동기 query 도중 사라질 수 있습니다. 현재 epoch는 숨긴 채로 둡니다.
    }
  }, [
    gutter,
    intrinsicSize,
    isOpenRef,
    layerRef,
    maxHeight,
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

  const measureIntrinsicSize = React.useCallback(async () => {
    "background only";
    const scrollNode = scrollNodeRef.current;
    const scrollContentNode = scrollContentNodeRef.current;
    const epoch = openEpochRef.current;
    const config = measurementConfigRef.current;
    if (!isOpenRef.current || !scrollAreaId || !scrollNode || !scrollContentNode) return;
    const version = ++intrinsicMeasurementVersionRef.current;
    try {
      const rect = await getRectByRef({ current: scrollContentNode }, false, scrollAreaId);
      if (
        version !== intrinsicMeasurementVersionRef.current ||
        !isOpenRef.current ||
        epoch !== openEpochRef.current ||
        config !== measurementConfigRef.current
      ) {
        return;
      }
      setIntrinsicSize((current) =>
        current?.width === rect.width &&
        current.height === rect.height &&
        current.epoch === epoch &&
        current.config === config
          ? current
          : { width: rect.width, height: rect.height, epoch, config },
      );
    } catch {
      // 숨긴 레이어가 query 도중 node를 놓을 수 있습니다.
    }
  }, [isOpenRef, openEpochRef, scrollAreaId]);

  React.useEffect(() => {
    "background only";
    measurementVersionRef.current++;
    intrinsicMeasurementVersionRef.current++;
    scrollRequestVersionRef.current++;
    setWidthConstraint(null);
    resetPosition();
    // 닫힘 전환 중에 다시 열면 layout이 바뀌지 않으므로 이전 크기를 이어 쓰고 다시 측정합니다.
    setIntrinsicSize((current) => (current ? { ...current, epoch: openEpoch } : current));
    scrolledEpochRef.current = null;
    if (scrollNodeRef.current && scrollContentNodeRef.current) void measureIntrinsicSize();
  }, [openEpoch, measureIntrinsicSize, resetPosition]);
  React.useEffect(() => {
    "background only";
    if (open) return;
    measurementVersionRef.current++;
    intrinsicMeasurementVersionRef.current++;
    scrollRequestVersionRef.current++;
  }, [open]);
  React.useEffect(() => {
    "background only";
    return () => {
      measurementVersionRef.current++;
      intrinsicMeasurementVersionRef.current++;
      scrollRequestVersionRef.current++;
    };
  }, []);
  React.useEffect(() => {
    "background only";
    if (
      configuredMaxHeightRef.current === maxHeight &&
      areStylesEqual(configuredStyleRef.current, style)
    ) {
      return;
    }
    measurementVersionRef.current++;
    intrinsicMeasurementVersionRef.current++;
    scrollRequestVersionRef.current++;
    measurementConfigRef.current++;
    configuredStyleRef.current = style;
    configuredMaxHeightRef.current = maxHeight;
    setWidthConstraint(null);
    setIntrinsicSize(null);
    resetPosition();
    if (scrollNodeRef.current && scrollContentNodeRef.current) void measureIntrinsicSize();
  }, [maxHeight, measureIntrinsicSize, resetPosition, style]);
  React.useEffect(() => {
    "background only";
    if (scrollAttached && scrollContentAttached) void measureIntrinsicSize();
  }, [measureIntrinsicSize, scrollAttached, scrollContentAttached]);
  React.useEffect(() => {
    "background only";
    if (open) void measurePosition();
  }, [open, measurePosition]);
  React.useEffect(() => {
    "background only";
    if (open && widthConstraint != null) void measureIntrinsicSize();
  }, [open, measureIntrinsicSize, widthConstraint]);
  React.useEffect(() => {
    "background only";
    const requestVersion = ++scrollRequestVersionRef.current;
    const epoch = openEpoch;
    const scrollNode = scrollNodeRef.current;
    if (
      !open ||
      !positioned ||
      !position ||
      !intrinsicSize ||
      intrinsicSize.epoch !== epoch ||
      intrinsicSize.config !== measurementConfigRef.current ||
      !selectedItemNode ||
      !scrollNode ||
      !scrollAreaId ||
      scrolledEpochRef.current === epoch
    ) {
      return;
    }
    if (intrinsicSize.height <= position.height) {
      scrolledEpochRef.current = epoch;
      return;
    }
    void getRectByRef({ current: selectedItemNode }, false, scrollAreaId)
      .then((item) => {
        if (
          requestVersion !== scrollRequestVersionRef.current ||
          !isOpenRef.current ||
          epoch !== openEpochRef.current ||
          scrolledEpochRef.current === epoch
        ) {
          return;
        }
        const offset =
          item.top < 0
            ? item.top
            : item.bottom > position.height
              ? item.bottom - position.height
              : 0;
        if (offset === 0) {
          scrolledEpochRef.current = epoch;
          return;
        }
        try {
          scrollNode.invoke({ method: "scrollBy", params: { offset } }).exec();
          scrolledEpochRef.current = epoch;
        } catch {
          // 테스트 ref는 native UI method를 구현하지 않습니다.
        }
      })
      .catch(() => {
        // 항목이 native 위치를 얻기 전에 교체될 수 있습니다.
      });
  }, [
    intrinsicSize,
    isOpenRef,
    open,
    openEpoch,
    openEpochRef,
    position,
    positioned,
    scrollAreaId,
    scrollAttached,
    selectedItemNode,
  ]);
  React.useEffect(() => {
    "background only";
    if (open || !mounted) return;
    const timer = setTimeout(() => {
      "background only";
      finishClose();
    }, EXIT_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [mounted, open, finishClose]);

  const handleScrollRef = React.useCallback((node: NodesRef | null) => {
    scrollNodeRef.current = node;
    if (node && !scrollAttachedRef.current) {
      scrollAttachedRef.current = true;
      setScrollAttached(true);
    }
  }, []);
  const handleScrollContentRef = React.useCallback((node: NodesRef | null) => {
    scrollContentNodeRef.current = node;
    if (node && !scrollContentAttachedRef.current) {
      scrollContentAttachedRef.current = true;
      setScrollContentAttached(true);
    }
  }, []);
  const handleScrollContentLayoutChange = React.useCallback<LayoutHandler>(() => {
    "background only";
    void measureIntrinsicSize();
  }, [measureIntrinsicSize]);
  const handleRef = React.useCallback((node: NodesRef | null) => assignNodeRef(ref, node), [ref]);

  const enableScroll = Boolean(
    position &&
      intrinsicSize &&
      intrinsicSize.epoch === openEpoch &&
      intrinsicSize.config === measurementConfigRef.current &&
      intrinsicSize.height > position.height,
  );
  const viewportHeight = position?.height;
  const scrollAreaBinding = React.useMemo<SelectScrollAreaBinding>(
    () => ({
      scrollAreaProps: {
        ref: handleScrollRef,
        id: scrollAreaId,
        "scroll-orientation": "vertical",
        "enable-scroll": enableScroll,
        style: viewportHeight === undefined ? undefined : { height: toPixel(viewportHeight) },
      },
      contentProps: {
        ref: handleScrollContentRef,
        bindlayoutchange: handleScrollContentLayoutChange,
      },
    }),
    [
      enableScroll,
      handleScrollContentLayoutChange,
      handleScrollContentRef,
      handleScrollRef,
      scrollAreaId,
      viewportHeight,
    ],
  );
  const placed = positioned && position !== null && layerRect !== null;

  return (
    <view
      ref={handleRef as ViewProps["ref"]}
      style={{
        position: "absolute",
        left: toPixel(placed ? position.left - layerRect.left : 0),
        top: toPixel(placed ? position.top - layerRect.top : 0),
        visibility: placed ? "visible" : "hidden",
        transformOrigin: placed ? position.transformOrigin : "center",
        ...(placed ? { width: toPixel(position.width) } : {}),
        ...style,
        ...(widthConstraint != null ? { width: toPixel(widthConstraint) } : {}),
      }}
      {...nativeProps}
    >
      <SelectScrollAreaContext.Provider value={scrollAreaBinding}>
        {children}
      </SelectScrollAreaContext.Provider>
    </view>
  );
});
SelectContent.displayName = "SelectContent";

////////////////////////////////////////////////////////////////////////////////////
// ScrollArea
////////////////////////////////////////////////////////////////////////////////////

export interface SelectScrollAreaProps extends Omit<ScrollViewProps, "style"> {
  style?: CSSProperties;
  /** 목록 전체를 감싸는 native `<view>`의 className입니다. */
  contentClassName?: string;
}

/**
 * 목록 viewport인 세로 native `<scroll-view>`와 그 안의 목록 `<view>`입니다. `SelectContent` 안에 둡니다.
 * `SelectContent`가 목록 `<view>`의 크기로 위치를 계산하고, viewport 높이를 정하며, 선택 항목이 보이도록
 * 스크롤합니다. 직접 viewport를 렌더링하려면 `useSelectScrollArea`를 사용하세요.
 */
export const SelectScrollArea = React.forwardRef<unknown, SelectScrollAreaProps>((props, ref) => {
  const { children, style, contentClassName, ...nativeProps } = props;
  const { scrollAreaProps, contentProps } = useSelectScrollArea();
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      scrollAreaProps.ref(node);
      assignNodeRef(ref, node);
    },
    [ref, scrollAreaProps.ref],
  );

  return (
    <scroll-view
      {...nativeProps}
      ref={handleRef as ScrollViewProps["ref"]}
      id={scrollAreaProps.id}
      scroll-orientation={scrollAreaProps["scroll-orientation"]}
      enable-scroll={scrollAreaProps["enable-scroll"]}
      style={{ ...style, ...scrollAreaProps.style }}
    >
      <view
        ref={contentProps.ref as ViewProps["ref"]}
        className={contentClassName}
        bindlayoutchange={contentProps.bindlayoutchange}
      >
        {children}
      </view>
    </scroll-view>
  );
});
SelectScrollArea.displayName = "SelectScrollArea";

////////////////////////////////////////////////////////////////////////////////////
// Group
////////////////////////////////////////////////////////////////////////////////////

export interface SelectGroupProps extends ViewProps {}

/** 항목을 묶는 native `<view>`입니다. */
export const SelectGroup = React.forwardRef<unknown, SelectGroupProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
      {children}
    </view>
  );
});
SelectGroup.displayName = "SelectGroup";

export interface SelectGroupLabelProps extends TextProps {}

/** 그룹 제목 native `<text>`입니다. `accessibility-heading`을 기본값으로 둡니다. */
export const SelectGroupLabel = React.forwardRef<unknown, SelectGroupLabelProps>((props, ref) => {
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
SelectGroupLabel.displayName = "SelectGroupLabel";

////////////////////////////////////////////////////////////////////////////////////
// Item
////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemProps
  extends Omit<UseSelectItemProps, "ref">,
    Omit<ViewProps, keyof UseSelectItemProps> {}

/**
 * 선택 항목 native `<view>`입니다. `useSelectItem`으로 등록·선택·접근성을 연결합니다. 하위 요소는
 * `useSelectItemContext`로 `selected`·`disabled`·`pressed`와 `label`·`icon`을 읽습니다.
 */
export const SelectItem = React.forwardRef<unknown, SelectItemProps>((props, ref) => {
  const {
    children,
    value,
    label,
    textValue,
    icon,
    disabled,
    readOnly,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    ...nativeProps
  } = props;
  const api = useSelectItem({
    ref,
    value,
    label,
    textValue,
    icon,
    disabled,
    readOnly,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
  });

  return (
    <SelectItemProvider value={api}>
      <view
        ref={api.rootRef as ViewProps["ref"]}
        {...nativeProps}
        {...api.rootProps}
        bindtouchstart={withPressTouch(bindtouchstart, api.rootProps.bindtouchstart)}
        bindtouchend={withPressTouch(bindtouchend, api.rootProps.bindtouchend)}
        bindtouchcancel={withPressTouch(bindtouchcancel, api.rootProps.bindtouchcancel)}
      >
        {children}
      </view>
    </SelectItemProvider>
  );
});
SelectItem.displayName = "SelectItem";

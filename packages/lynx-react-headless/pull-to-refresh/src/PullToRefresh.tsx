import {
  forwardRef,
  type ReactNode,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
} from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements, NodesRef } from "@lynx-js/types";
import {
  usePullToRefresh,
  type PullToRefreshIndicatorRenderProps,
  type UsePullToRefreshProps,
} from "./usePullToRefresh";
import { PullToRefreshProvider, usePullToRefreshContext } from "./usePullToRefreshContext";

type ViewProps = IntrinsicElements["view"];
type ScrollProps = IntrinsicElements["scroll-view"];

/** @platform Lynx Root는 clip 컨테이너이며 Content가 세로 scroll host입니다. asChild는 지원하지 않습니다. */
export interface PullToRefreshRootProps
  extends UsePullToRefreshProps,
    Pick<
      ViewProps,
      | "id"
      | "className"
      | "style"
      | "hidden"
      | "accessibility-label"
      | "accessibility-elements-hidden"
    > {
  children?: ReactNode;
}

/** @platform Lynx 높이는 children·style로 결정하며 실제 layout 높이를 측정해 당김 위치를 계산합니다. */
export interface PullToRefreshIndicatorProps extends Pick<ViewProps, "id" | "className" | "style"> {
  children: (props: PullToRefreshIndicatorRenderProps) => ReactNode;
}

/**
 * @platform Lynx Content만 scroll host로 사용하며 중첩 scroller 탐지는 지원하지 않습니다.
 * PTR이 경계 변위를 소유하므로 native bounces는 false로 고정하며 iOS 아래쪽 경계의 bounce도 꺼집니다.
 * 당김 중 native 스크롤이 경계를 벗어나면 즉시 0으로 되돌리며 enable-scroll 설정은 바꾸지 않습니다.
 */
export interface PullToRefreshContentProps
  extends Pick<
    ScrollProps,
    | "id"
    | "className"
    | "style"
    | "hidden"
    | "enable-scroll"
    | "scroll-bar-enable"
    | "upper-threshold"
    | "lower-threshold"
    | "initial-scroll-offset"
    | "initial-scroll-to-index"
    | "bindscroll"
    | "bindscrolltoupper"
    | "bindscrolltolower"
    | "bindscrollend"
    | "bindcontentsizechanged"
    | "bindtap"
    | "main-thread:bindtap"
    | "accessibility-label"
    | "accessibility-elements-hidden"
  > {
  children?: ReactNode;
}

function geometry(
  style: CSSProperties | string | undefined,
  required: CSSProperties,
): CSSProperties | string {
  if (typeof style === "string") {
    return `${style};${Object.entries(required)
      .map(
        ([key, value]) =>
          `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${value}`,
      )
      .join(";")}`;
  }
  return { ...style, ...required };
}

export const PullToRefreshRoot: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshRootProps> & RefAttributes<NodesRef>
> = forwardRef<NodesRef, PullToRefreshRootProps>((props, ref) => {
  const {
    children,
    style,
    threshold,
    displacementMultiplier,
    disabled,
    onPtrPullStart,
    onPtrPullMove,
    onPtrPullEnd,
    onPtrReady,
    onPtrRefresh,
    ...nativeProps
  } = props;
  const api = usePullToRefresh({
    threshold,
    displacementMultiplier,
    disabled,
    onPtrPullStart,
    onPtrPullMove,
    onPtrPullEnd,
    onPtrReady,
    onPtrRefresh,
  });
  const rootProps: Record<string, unknown> = {
    ...nativeProps,
    ...(ref ? { ref } : {}),
    style: geometry(style, { position: "relative", overflow: "hidden" }),
    "main-thread:capture-bindtouchstart": api.resetContact,
  };
  return (
    <PullToRefreshProvider value={api}>
      <view {...rootProps}>{children}</view>
    </PullToRefreshProvider>
  );
});
PullToRefreshRoot.displayName = "PullToRefreshRoot";

export const PullToRefreshIndicator: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshIndicatorProps> & RefAttributes<NodesRef>
> = forwardRef<NodesRef, PullToRefreshIndicatorProps>((props, ref) => {
  const { children, style, ...nativeProps } = props;
  const { state, threshold, indicatorRef, handleIndicatorLayout, mainThreadProgress } =
    usePullToRefreshContext();
  const indicatorProps: Record<string, unknown> = {
    ...nativeProps,
    ...(ref ? { ref } : {}),
    "main-thread:ref": indicatorRef,
    "main-thread:bindlayoutchange": handleIndicatorLayout,
    "event-through": true,
    "accessibility-elements-hidden": true,
    style: geometry(style, {
      position: "absolute",
      top: "0px",
      left: "0px",
      right: "0px",
      transform: `translateY(${-threshold}px)`,
      opacity: 0,
    }),
  };
  return (
    <view {...indicatorProps}>
      {children({
        minValue: 0,
        maxValue: 100,
        value: state === "loading" ? undefined : 0,
        mainThreadProgress,
      })}
    </view>
  );
});
PullToRefreshIndicator.displayName = "PullToRefreshIndicator";

export const PullToRefreshContent: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshContentProps> & RefAttributes<NodesRef>
> = forwardRef<NodesRef, PullToRefreshContentProps>((props, ref) => {
  const { children, style, "enable-scroll": enabled = true, ...nativeProps } = props;
  const { gesture, contentRef, handleScroll } = usePullToRefreshContext();
  const contentProps: Record<string, unknown> = {
    ...nativeProps,
    ...(ref ? { ref } : {}),
    style,
    "scroll-orientation": "vertical",
    bounces: false,
    "enable-scroll": enabled,
    "main-thread:gesture": gesture,
    "main-thread:ref": contentRef,
    "main-thread:bindscroll": handleScroll,
  };
  return <scroll-view {...contentProps}>{children}</scroll-view>;
});
PullToRefreshContent.displayName = "PullToRefreshContent";

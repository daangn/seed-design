import {
  forwardRef,
  type ReactNode,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
  type Ref,
} from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements, MainThread, NodesRef } from "@lynx-js/types";
import {
  usePullToRefresh,
  type PullToRefreshIndicatorRenderProps,
  type UsePullToRefreshProps,
} from "./usePullToRefresh";
import { PullToRefreshProvider, usePullToRefreshContext } from "./usePullToRefreshContext";

type ViewProps = IntrinsicElements["view"];
type ScrollProps = IntrinsicElements["scroll-view"];
type ListProps = IntrinsicElements["list"];
type ScrollViewScrollEvent = Parameters<NonNullable<ScrollProps["bindscroll"]>>[0];
type ListScrollEvent = Parameters<NonNullable<ListProps["bindscroll"]>>[0];
type ListScrollToUpperEvent = Parameters<NonNullable<ListProps["bindscrolltoupper"]>>[0];

/** @platform Lynx Root는 clip 컨테이너이며 Content가 세로 scroll host입니다. asChild는 지원하지 않습니다. */
export interface PullToRefreshRootProps
  extends UsePullToRefreshProps,
    Omit<ViewProps, keyof UsePullToRefreshProps | "ref" | "children"> {
  children?: ReactNode;
}

/** @platform Lynx 높이는 children·style로 결정하며 실제 layout 높이를 측정해 당김 위치를 계산합니다. */
export interface PullToRefreshIndicatorProps extends Omit<ViewProps, "ref" | "children"> {
  children: (props: PullToRefreshIndicatorRenderProps) => ReactNode;
}

/**
 * @platform Lynx Content만 scroll host로 사용하며 중첩 scroller 탐지는 지원하지 않습니다.
 * native bounces의 기본값은 false이며 iOS 아래쪽 경계의 bounce도 꺼집니다. 사용자 native props로 변경할 수 있습니다.
 * 당김 중 native 스크롤이 경계를 벗어나면 즉시 0으로 되돌리며 enable-scroll 설정은 바꾸지 않습니다.
 */
export interface PullToRefreshContentProps extends Omit<ScrollProps, "ref" | "children"> {
  children?: ReactNode;
  /** 내부 MT scroll handler와 합성합니다. 설치된 Lynx 타입에 이 native key가 없어 직접 선언합니다. */
  "main-thread:bindscroll"?: (event: ScrollViewScrollEvent) => void;
}

/**
 * @platform Lynx Content 대신 세로 `<list>`를 scroll host로 사용합니다. children은 `<list-item>`으로 구성합니다.
 * `custom-list-name`의 기본값은 `"list-container"`입니다. iOS 기본 list 구현은 당김을 가로채는 gesture intercept를
 * native 스크롤에 연결하지 않아, 당김 중 list가 함께 스크롤될 수 있습니다. 사용자 native props로 변경할 수 있습니다.
 * native bounces의 기본값은 false이며 iOS 아래쪽 경계의 bounce도 꺼집니다.
 * 당김 중 native 스크롤이 경계를 벗어나면 `scrollToPosition`으로 첫 항목에 되돌립니다.
 * 맨 위 판정은 scroll 이벤트의 `scrollTop`을 따르고 scrolltoupper 이벤트로 보완합니다. list의 scroll 이벤트는 throttle되어
 * 맨 위에 닿은 마지막 이벤트가 빠질 수 있습니다. 두 이벤트가 모두 늦게 오면 빠르게 맨 위로 스크롤한 직후의 당김이 거부될 수 있습니다.
 */
export interface PullToRefreshListContentProps extends Omit<ListProps, "ref" | "children"> {
  children?: ReactNode;
  /** list 구현 이름입니다. 설치된 Lynx 타입에 이 native key가 없어 직접 선언합니다. @default "list-container" */
  "custom-list-name"?: string;
  /** 내부 MT scroll handler와 합성합니다. 설치된 Lynx 타입에 이 native key가 없어 직접 선언합니다. */
  "main-thread:bindscroll"?: (event: ListScrollEvent) => void;
  /** 내부 MT 맨 위 판정 handler와 합성합니다. */
  "main-thread:bindscrolltoupper"?: (event: ListScrollToUpperEvent) => void;
}

function geometry(style: ViewProps["style"], defaults: CSSProperties): CSSProperties | string {
  if (typeof style === "string") {
    return `${Object.entries(defaults)
      .map(
        ([key, value]) =>
          `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${value}`,
      )
      .join(";")};${style}`;
  }
  return { ...defaults, ...style };
}

function composeMainThreadHandlers<Args extends unknown[]>(
  internal: (...args: Args) => void,
  user: ((...args: Args) => void) | null | undefined,
): (...args: Args) => void {
  if (!user) return internal;
  return (...args) => {
    "main thread";
    user(...args);
    internal(...args);
  };
}

function assignMainThreadRef(ref: Ref<MainThread.Element>, node: MainThread.Element | null) {
  "main thread";
  if (typeof ref === "function") return ref(node);
  if (ref) ref.current = node;
}

function composeMainThreadRefs(
  internal: Ref<MainThread.Element>,
  user: ViewProps["main-thread:ref"],
): Ref<MainThread.Element> {
  if (!user) return internal;
  return (node) => {
    "main thread";
    const internalCleanup = assignMainThreadRef(internal, node);
    const userCleanup = assignMainThreadRef(user, node);
    return () => {
      if (typeof internalCleanup === "function") internalCleanup();
      else assignMainThreadRef(internal, null);
      if (typeof userCleanup === "function") userCleanup();
      else assignMainThreadRef(user, null);
    };
  };
}

export const PullToRefreshRoot: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshRootProps> & RefAttributes<NodesRef>
> = forwardRef<NodesRef, PullToRefreshRootProps>((props, ref) => {
  const {
    children,
    style,
    "main-thread:capture-bindtouchstart": userResetContact,
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
    style: geometry(style, { position: "relative", overflow: "hidden" }),
    ...nativeProps,
    ...(ref ? { ref } : {}),
    "main-thread:capture-bindtouchstart": composeMainThreadHandlers<
      Parameters<NonNullable<ViewProps["main-thread:capture-bindtouchstart"]>>
    >(api.resetContact, userResetContact),
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
  const {
    children,
    style,
    "main-thread:ref": userMainThreadRef,
    "main-thread:bindlayoutchange": userLayoutChange,
    ...nativeProps
  } = props;
  const { state, threshold, indicatorRef, handleIndicatorLayout, mainThreadProgress } =
    usePullToRefreshContext();
  const indicatorProps: Record<string, unknown> = {
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
    ...nativeProps,
    ...(ref ? { ref } : {}),
    "main-thread:ref": composeMainThreadRefs(indicatorRef, userMainThreadRef),
    "main-thread:bindlayoutchange": composeMainThreadHandlers(
      handleIndicatorLayout,
      userLayoutChange,
    ),
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
  const {
    children,
    style,
    "main-thread:ref": userMainThreadRef,
    "main-thread:bindscroll": userScroll,
    ...nativeProps
  } = props;
  const { gesture, contentRef, handleScroll } = usePullToRefreshContext();
  const contentProps: Record<string, unknown> = {
    style,
    "scroll-orientation": "vertical",
    bounces: false,
    "enable-scroll": true,
    "main-thread:gesture": gesture,
    ...nativeProps,
    ...(ref ? { ref } : {}),
    "main-thread:ref": composeMainThreadRefs(contentRef, userMainThreadRef),
    "main-thread:bindscroll": composeMainThreadHandlers(handleScroll, userScroll),
  };
  return <scroll-view {...contentProps}>{children}</scroll-view>;
});
PullToRefreshContent.displayName = "PullToRefreshContent";

export const PullToRefreshListContent: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshListContentProps> & RefAttributes<NodesRef>
> = forwardRef<NodesRef, PullToRefreshListContentProps>((props, ref) => {
  const {
    children,
    style,
    "main-thread:ref": userMainThreadRef,
    "main-thread:bindscroll": userScroll,
    "main-thread:bindscrolltoupper": userScrollToUpper,
    ...nativeProps
  } = props;
  const { gesture, contentRef, handleListScroll } = usePullToRefreshContext();
  const contentProps: Record<string, unknown> = {
    // transform을 나중에 처음 붙이면 list layout이 다시 계산되어 layoutcomplete가 한 번 더 옵니다.
    style: geometry(style, { transform: "translateY(0px)" }),
    "custom-list-name": "list-container",
    "scroll-orientation": "vertical",
    bounces: false,
    "enable-scroll": true,
    "main-thread:gesture": gesture,
    ...nativeProps,
    ...(ref ? { ref } : {}),
    "main-thread:ref": composeMainThreadRefs(contentRef, userMainThreadRef),
    "main-thread:bindscroll": composeMainThreadHandlers(handleListScroll, userScroll),
    // scroll 이벤트는 throttle로 맨 위에 닿은 마지막 값이 빠질 수 있어 scrolltoupper로 보완합니다.
    "main-thread:bindscrolltoupper": composeMainThreadHandlers(handleListScroll, userScrollToUpper),
  };
  return <list {...contentProps}>{children}</list>;
});
PullToRefreshListContent.displayName = "PullToRefreshListContent";

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
  type UsePullToRefreshContext,
} from "./usePullToRefresh";
import { PullToRefreshProvider, usePullToRefreshContext } from "./usePullToRefreshContext";

type ViewProps = IntrinsicElements["view"];
type ScrollProps = IntrinsicElements["scroll-view"];

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
  /** 내부 MT scroll handler와 합성합니다. 설치된 Lynx 타입에 이 native key가 없어 내부 handler 타입을 사용합니다. */
  "main-thread:bindscroll"?: UsePullToRefreshContext["handleScroll"];
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

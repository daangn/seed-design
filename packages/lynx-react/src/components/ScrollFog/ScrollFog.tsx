import * as React from "@lynx-js/react";
import type {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";

type NativeScrollViewProps = Omit<IntrinsicElements["scroll-view"], `main-thread:${string}`>;
type LynxForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

type ScrollFogPlacement = ["top", "bottom"] | ["left", "right"];

/**
 * @platform Lynx
 *
 * A native scroll-view with fading edges at both ends of one scroll axis.
 */
export interface ScrollFogProps
  extends Omit<
    NativeScrollViewProps,
    | "className"
    | "style"
    | "scroll-orientation"
    | "scroll-x"
    | "scroll-y"
    | "scroll-bar-enable"
    | "fading-edge-length"
  > {
  children?: ReactNode;
  className?: NativeScrollViewProps["className"];
  style?: NativeScrollViewProps["style"];
  /**
   * Fog 효과를 표시할 축입니다.
   * @defaultValue ["top", "bottom"]
   */
  placement?: ScrollFogPlacement;
  /**
   * 활성 축 양쪽에 적용할 Fog 효과의 길이입니다.
   * 숫자는 px 단위로 처리합니다.
   * @defaultValue 20
   */
  size?: number | string;
  /**
   * Native scroll indicator를 숨깁니다.
   * @defaultValue false
   */
  hideScrollBar?: boolean;
}

export const ScrollFog: LynxForwardRefComponent<NodesRef, ScrollFogProps> = React.forwardRef<
  NodesRef,
  ScrollFogProps
>((props, forwardedRef) => {
  const {
    children,
    className,
    style,
    placement = ["top", "bottom"],
    size = 20,
    hideScrollBar = false,
    ...nativeProps
  } = props;

  const orientation: NativeScrollViewProps["scroll-orientation"] =
    placement[0] === "left" ? "horizontal" : "vertical";
  const fadingEdgeLength = typeof size === "number" ? `${size}px` : size;
  const forcedNativeProps = {
    // @lynx-js/types 3.9 does not declare this native scroll-view attribute yet.
    "fading-edge-length": fadingEdgeLength,
    "scroll-orientation": orientation,
    "scroll-bar-enable": !hideScrollBar,
  };

  return (
    <scroll-view
      {...(forwardedRef ? ({ ref: forwardedRef } as Record<string, unknown>) : {})}
      {...nativeProps}
      {...forcedNativeProps}
      className={className}
      style={style}
    >
      {children}
    </scroll-view>
  );
});
ScrollFog.displayName = "ScrollFog";

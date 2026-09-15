import {
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes,
} from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";

type NativeScrollViewProps = IntrinsicElements["scroll-view"];
type LynxForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

type ScrollFogPlacement = ["top", "bottom"] | ["left", "right"];

/**
 * @platform Lynx
 *
 * A native scroll-view with fading edges at both ends of its scroll axis.
 * The native fading edge is not supported on Harmony.
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
  placement?: ScrollFogPlacement;
  size?: number | string;
  hideScrollBar?: boolean;
}

export const ScrollFog: LynxForwardRefComponent<NodesRef, ScrollFogProps> = forwardRef<
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

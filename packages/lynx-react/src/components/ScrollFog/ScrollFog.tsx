import { scrollFog } from "@seed-design/lynx-css/recipes/scroll-fog";
import { scrollFog as scrollFogVars } from "@seed-design/lynx-css/vars/component";
import * as React from "@lynx-js/react";
import type {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import clsx from "clsx";

type NativeViewProps = Omit<IntrinsicElements["view"], `main-thread:${string}`>;
type LynxForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

type ScrollFogPlacement = "top" | "bottom" | "left" | "right";

type SizesConfig = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

const DEFAULT_SIZE = scrollFogVars.base.enabled.root.size;

function normalizeSize(size: number | string): string {
  return typeof size === "number" ? `${size}px` : size;
}

function createRootStyle(
  style: NativeViewProps["style"],
  sizes: Record<ScrollFogPlacement, string>,
): NativeViewProps["style"] {
  const variables = {
    "--scroll-fog-size-top": sizes.top,
    "--scroll-fog-size-bottom": sizes.bottom,
    "--scroll-fog-size-left": sizes.left,
    "--scroll-fog-size-right": sizes.right,
  };

  if (typeof style === "string") {
    const variableStyle = Object.entries(variables)
      .map(([property, value]) => `${property}: ${value}`)
      .join("; ");

    return `${style}; ${variableStyle}`;
  }

  return { ...style, ...variables } as NativeViewProps["style"];
}

/**
 * @platform Lynx
 *
 * A two-axis scroll area with independently configurable edge masks.
 */
export interface ScrollFogProps extends Omit<NativeViewProps, "children" | "className" | "style"> {
  children?: ReactNode;
  className?: NativeViewProps["className"];
  style?: NativeViewProps["style"];
  /**
   * Fog 효과를 표시할 방향입니다.
   * @defaultValue ["top", "bottom"]
   */
  placement?: ScrollFogPlacement[];
  /**
   * Fog 효과의 크기입니다. 숫자는 px 단위로 처리합니다.
   * @defaultValue 20
   */
  size?: number | string;
  /** 방향별 Fog 효과의 크기입니다. 숫자는 px 단위로 처리합니다. */
  sizes?: SizesConfig;
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
    size = DEFAULT_SIZE,
    sizes,
    hideScrollBar = false,
    ...rootProps
  } = props;
  const normalizedSize = normalizeSize(size);
  const topSize = sizes?.top ? normalizeSize(sizes.top) : normalizedSize;
  const bottomSize = sizes?.bottom ? normalizeSize(sizes.bottom) : normalizedSize;
  const leftSize = sizes?.left ? normalizeSize(sizes.left) : normalizedSize;
  const rightSize = sizes?.right ? normalizeSize(sizes.right) : normalizedSize;
  const scrollBarEnabled = !hideScrollBar;
  const classNames = scrollFog({
    top: placement.includes("top"),
    bottom: placement.includes("bottom"),
    left: placement.includes("left"),
    right: placement.includes("right"),
  });
  let content: ReactNode = (
    <scroll-view
      enable-nested-scroll
      scroll-bar-enable={scrollBarEnabled}
      scroll-orientation="vertical"
      className={classNames.verticalScroll}
    >
      <scroll-view
        enable-nested-scroll
        scroll-bar-enable={scrollBarEnabled}
        scroll-orientation="horizontal"
        className={classNames.horizontalScroll}
      >
        {children}
      </scroll-view>
    </scroll-view>
  );

  if (placement.includes("right")) {
    content = (
      <view flatten={false} className={classNames.rightMask}>
        {content}
      </view>
    );
  }
  if (placement.includes("left")) {
    content = (
      <view flatten={false} className={classNames.leftMask}>
        {content}
      </view>
    );
  }
  if (placement.includes("bottom")) {
    content = (
      <view flatten={false} className={classNames.bottomMask}>
        {content}
      </view>
    );
  }
  if (placement.includes("top")) {
    content = (
      <view flatten={false} className={classNames.topMask}>
        {content}
      </view>
    );
  }

  return (
    <view
      {...(forwardedRef ? ({ ref: forwardedRef } as Record<string, unknown>) : {})}
      {...rootProps}
      className={clsx(classNames.root, className)}
      style={createRootStyle(style, {
        top: topSize,
        bottom: bottomSize,
        left: leftSize,
        right: rightSize,
      })}
    >
      {content}
    </view>
  );
});
ScrollFog.displayName = "ScrollFog";

import { scrollFog } from "@seed-design/lynx-css/recipes/scroll-fog";
import { scrollFog as scrollFogVars } from "@seed-design/lynx-css/vars/component";
import * as React from "@lynx-js/react";
import type {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import clsx from "clsx";

import type { LynxHostProps } from "../../types";
import { mergeProps } from "../../utils/merge-props";
type LynxForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

type ScrollFogVerticalPlacement = "top" | "bottom";
type ScrollFogHorizontalPlacement = "left" | "right";
type ScrollFogPlacement = ScrollFogVerticalPlacement | ScrollFogHorizontalPlacement;

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
  style: LynxHostProps<"view">["style"],
  sizes: Record<ScrollFogPlacement, string>,
): LynxHostProps<"view">["style"] {
  const variables = {
    "--scroll-fog-size-top": sizes.top,
    "--scroll-fog-size-bottom": sizes.bottom,
    "--scroll-fog-size-left": sizes.left,
    "--scroll-fog-size-right": sizes.right,
  };

  return { ...variables, ...style } as LynxHostProps<"view">["style"];
}

/**
 * @platform Lynx
 *
 * Edge masks for a single-axis scroll container. ScrollFog does not scroll;
 * place a `scroll-view` (or a component that owns one) inside it.
 */
export interface ScrollFogProps extends LynxHostProps<"view"> {
  /**
   * Fog 효과를 표시할 방향입니다. Lynx `scroll-view`는 한 축으로만 스크롤하므로
   * 세로(`top`·`bottom`) 또는 가로(`left`·`right`) 중 한 축의 방향만 지정할 수 있습니다.
   * @defaultValue ["top", "bottom"]
   */
  placement?: ScrollFogVerticalPlacement[] | ScrollFogHorizontalPlacement[];
  /**
   * Fog 효과의 크기입니다. 숫자는 px 단위로 처리합니다.
   * @defaultValue 20
   */
  size?: number | string;
  /** 방향별 Fog 효과의 크기입니다. 숫자는 px 단위로 처리합니다. */
  sizes?: SizesConfig;
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
    ...rootProps
  } = props;
  const edges: readonly ScrollFogPlacement[] = placement;
  const normalizedSize = normalizeSize(size);
  const topSize = sizes?.top ? normalizeSize(sizes.top) : normalizedSize;
  const bottomSize = sizes?.bottom ? normalizeSize(sizes.bottom) : normalizedSize;
  const leftSize = sizes?.left ? normalizeSize(sizes.left) : normalizedSize;
  const rightSize = sizes?.right ? normalizeSize(sizes.right) : normalizedSize;
  const classNames = scrollFog({
    top: edges.includes("top"),
    bottom: edges.includes("bottom"),
    left: edges.includes("left"),
    right: edges.includes("right"),
  });
  let content: ReactNode = children;

  if (edges.includes("right")) {
    content = (
      <view flatten={false} className={classNames.rightMask}>
        {content}
      </view>
    );
  }
  if (edges.includes("left")) {
    content = (
      <view flatten={false} className={classNames.leftMask}>
        {content}
      </view>
    );
  }
  if (edges.includes("bottom")) {
    content = (
      <view flatten={false} className={classNames.bottomMask}>
        {content}
      </view>
    );
  }
  if (edges.includes("top")) {
    content = (
      <view flatten={false} className={classNames.topMask}>
        {content}
      </view>
    );
  }

  return (
    <view
      {...mergeProps(
        {
          style: createRootStyle(style, {
            top: topSize,
            bottom: bottomSize,
            left: leftSize,
            right: rightSize,
          }),
        },
        rootProps,
        forwardedRef ? { ref: forwardedRef } : {},
      )}
      className={clsx(classNames.root, className)}
    >
      {content}
    </view>
  );
});
ScrollFog.displayName = "ScrollFog";

'use client';
import { scrollFog, type ScrollFogVariantProps } from "@ride-developer/css/recipes/scroll-fog";
import clsx from "clsx";
import { forwardRef, useMemo } from "react";
import { scrollFog as vars } from "@ride-developer/css/vars/component";

type ScrollPlacement = "top" | "bottom" | "left" | "right";

type SizesConfig = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export interface ScrollFogProps
  extends ScrollFogVariantProps,
    React.HTMLAttributes<HTMLDivElement> {
  /**
   * Placement of fog effect
   * @default ["top", "bottom"]
   */
  placement?: ScrollPlacement[];

  /**
   * Size of the fog effect in pixels
   * @default 20
   */
  size?: number;

  /**
   * Size of the fog effect for each direction in pixels
   */
  sizes?: SizesConfig;
}

export const ScrollFog = forwardRef<HTMLDivElement, ScrollFogProps>(
  (
    {
      className,
      hideScrollBar,
      placement = ["top", "bottom"],
      size = vars.base.enabled.root.size,
      sizes,
      style,
      ...props
    },
    ref,
  ) => {
    const [variantProps, restProps] = scrollFog.splitVariantProps({
      hideScrollBar,
      ...props,
    });
    const scrollFogClassName = scrollFog(variantProps);
    const sizePx = typeof size === "number" ? `${size}px` : size;

    const sizeStyle = useMemo(() => {
      const finalSizes = {
        top: sizes?.top ? `${sizes.top}px` : sizePx,
        bottom: sizes?.bottom ? `${sizes.bottom}px` : sizePx,
        left: sizes?.left ? `${sizes.left}px` : sizePx,
        right: sizes?.right ? `${sizes.right}px` : sizePx,
      };

      return {
        "--scroll-fog-size-top": finalSizes.top,
        "--scroll-fog-size-bottom": finalSizes.bottom,
        "--scroll-fog-size-left": finalSizes.left,
        "--scroll-fog-size-right": finalSizes.right,
        // placement에 포함된 방향만 1, 나머지는 0
        "--scrollable-top": placement.includes("top") ? "1" : "0",
        "--scrollable-bottom": placement.includes("bottom") ? "1" : "0",
        "--scrollable-left": placement.includes("left") ? "1" : "0",
        "--scrollable-right": placement.includes("right") ? "1" : "0",
      } as React.CSSProperties;
    }, [sizePx, sizes, placement]);

    return (
      <div
        ref={ref}
        className={clsx(scrollFogClassName, className)}
        style={{
          ...style,
          ...sizeStyle,
        }}
        {...restProps}
      />
    );
  },
);
ScrollFog.displayName = "ScrollFog";

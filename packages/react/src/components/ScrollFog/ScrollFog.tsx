import { scrollFog, type ScrollFogVariantProps } from "@seed-design/css/recipes/scroll-fog";
import { clsx } from "cn";
import { forwardRef, useMemo } from "react";

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
   * Fog 효과를 표시할 방향입니다.
   * @default ["top", "bottom"]
   */
  placement?: ScrollPlacement[];

  /**
   * Fog 효과의 크기입니다. 숫자는 px 단위로 처리하며 CSS 길이 또는 계산식도 사용할 수 있습니다.
   * @default 20
   */
  size?: number | string;

  /** 방향별 Fog 효과의 크기입니다. */
  sizes?: SizesConfig;
}

export const ScrollFog = forwardRef<HTMLDivElement, ScrollFogProps>(
  (
    { className, hideScrollBar, placement = ["top", "bottom"], size = 20, sizes, style, ...props },
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

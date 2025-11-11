import { scrollFog, type ScrollFogVariantProps } from "@seed-design/css/recipes/scroll-fog";
import { Scrollable, type ScrollableProps } from "@seed-design/react-scrollable";
import clsx from "clsx";
import { forwardRef, useMemo } from "react";
import { scrollFog as vars } from "@seed-design/css/vars/component";

type SizesConfig = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export interface ScrollFogProps extends ScrollFogVariantProps, ScrollableProps {
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
    { className, hideScrollBar, size = vars.base.enabled.root.size, sizes, style, ...props },
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
      };
    }, [sizePx, sizes]);

    return (
      <Scrollable
        ref={ref}
        className={clsx(scrollFogClassName, className)}
        {...restProps}
        style={{
          ...style,
          ...sizeStyle,
        }}
      />
    );
  },
);
ScrollFog.displayName = "ScrollFog";

import { scrollFog, type ScrollFogVariantProps } from "@seed-design/css/recipes/scroll-fog";
import { Scrollable, type ScrollableProps } from "@seed-design/react-scrollable";
import clsx from "clsx";
import { forwardRef, useMemo } from "react";

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
  ({ className, hideScrollBar, size = 20, sizes, style, ...props }, ref) => {
    const [variantProps, restProps] = scrollFog.splitVariantProps({
      hideScrollBar,
      ...props,
    });
    const scrollFogClassName = scrollFog(variantProps);

    const sizeStyle = useMemo(() => {
      const finalSizes = {
        top: sizes?.top ?? size,
        bottom: sizes?.bottom ?? size,
        left: sizes?.left ?? size,
        right: sizes?.right ?? size,
      };

      return {
        "--scroll-fog-size-top": `${finalSizes.top}px`,
        "--scroll-fog-size-bottom": `${finalSizes.bottom}px`,
        "--scroll-fog-size-left": `${finalSizes.left}px`,
        "--scroll-fog-size-right": `${finalSizes.right}px`,
      };
    }, [size, sizes]);

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

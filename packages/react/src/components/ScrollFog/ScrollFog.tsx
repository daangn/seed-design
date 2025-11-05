import { scrollFog, type ScrollFogVariantProps } from "@seed-design/css/recipes/scroll-fog";
import {
  ScrollFog as ScrollFogPrimitive,
  type ScrollFogProps as ScrollFogPrimitiveProps,
} from "@seed-design/react-scroll-fog";
import clsx from "clsx";
import { forwardRef } from "react";

export interface ScrollFogProps extends ScrollFogVariantProps, ScrollFogPrimitiveProps {}

export const ScrollFog = forwardRef<HTMLDivElement, ScrollFogProps>(
  ({ className, hideScrollBar, ...props }, ref) => {
    const [variantProps, restProps] = scrollFog.splitVariantProps({
      hideScrollBar,
      ...props,
    });
    const scrollFogClassName = scrollFog(variantProps);
    return (
      <ScrollFogPrimitive
        className={clsx(scrollFogClassName, className)}
        {...restProps}
        ref={ref}
      />
    );
  },
);
ScrollFog.displayName = "ScrollFog";

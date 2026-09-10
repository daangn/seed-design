import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { skeleton, type SkeletonVariantProps } from "@seed-design/css/recipes/skeleton";
import { vars, type LineHeight } from "@seed-design/css/vars";
import type * as React from "react";
import { forwardRef } from "react";
import {
  isResponsiveObject,
  type ResponsiveValue,
  type UnwrapResponsive,
} from "../../types/responsive";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { useStyleProps, type StyleProps } from "../../utils/styled";

const { withContext } = createRecipeContext(skeleton);

export interface SkeletonProps
  extends SkeletonVariantProps,
    PrimitiveProps,
    Pick<StyleProps, "width">,
    Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  height?: ResponsiveValue<UnwrapResponsive<StyleProps["height"]> | `lineHeight.${LineHeight}`>;
}

function handleHeight(height: string | undefined) {
  if (!height?.startsWith("lineHeight.")) return height;

  const value = vars.$lineHeight[height.slice("lineHeight.".length) as LineHeight];

  return typeof value === "string" ? value : height;
}

export const Skeleton = withContext<HTMLDivElement, SkeletonProps>(
  forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({ height, ...props }, ref) {
    const { style, restProps } = useStyleProps({
      ...props,
      height: isResponsiveObject(height)
        ? Object.fromEntries(
            Object.entries(height).map(([key, value]) => [key, handleHeight(value)]),
          )
        : handleHeight(height),
    });

    return <Primitive.div ref={ref} style={style} {...restProps} />;
  }),
);

Skeleton.displayName = "Skeleton";

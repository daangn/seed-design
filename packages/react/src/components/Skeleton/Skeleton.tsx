import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { skeleton, type SkeletonVariantProps } from "@seed-design/css/recipes/skeleton";
import type * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { withStyleProps, type StyleProps } from "../../utils/styled";

const { withProvider } = createRecipeContext(skeleton);

export interface SkeletonProps
  extends SkeletonVariantProps,
    PrimitiveProps,
    Pick<StyleProps, "height" | "width">,
    Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {}

export const Skeleton = withProvider<HTMLDivElement, SkeletonProps>(withStyleProps(Primitive.div));

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { badge, type BadgeVariantProps } from "@seed-design/css/recipes/badge";
import type * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";

const { withProvider } = createRecipeContext(badge);

////////////////////////////////////////////////////////////////////////////////////

export interface BadgeProps
  extends BadgeVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const Badge = withProvider<HTMLSpanElement, BadgeProps>(Primitive.span);

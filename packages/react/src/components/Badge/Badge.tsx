import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { badge, type BadgeVariantProps } from "@seed-design/css/recipes/badge";
import type * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";

const { withContext } = createRecipeContext(badge);

////////////////////////////////////////////////////////////////////////////////////

export interface BadgeProps
  extends BadgeVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const Badge = withContext<HTMLSpanElement, BadgeProps>(Primitive.span);

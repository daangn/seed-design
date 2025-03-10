import {
  mannerTempBadge,
  type MannerTempBadgeVariantProps,
} from "@seed-design/css/recipes/manner-temp-badge";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";

const { withProvider } = createRecipeContext(mannerTempBadge);

////////////////////////////////////////////////////////////////////////////////////

export interface MannerTempBadgeProps
  extends MannerTempBadgeVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const MannerTempBadge = withProvider<HTMLSpanElement, MannerTempBadgeProps>(Primitive.span);

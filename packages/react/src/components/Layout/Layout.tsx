import type * as React from "react";

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { layout, type LayoutVariantProps } from "@seed-design/css/recipes/layout";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withProvider, withContext } = createSlotRecipeContext(layout);

export interface LayoutRootProps
  extends LayoutVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const LayoutRoot = withProvider<HTMLDivElement, LayoutRootProps>(Primitive.div, "root");

export interface LayoutContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const LayoutContent = withContext<HTMLDivElement, LayoutContentProps>(
  Primitive.div,
  "content",
);

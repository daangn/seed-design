import { fab, type FabVariantProps } from "@seed-design/css/recipes/fab";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { withProvider, withContext } = createSlotRecipeContext(fab);

////////////////////////////////////////////////////////////////////////////////////

export interface FabRootProps
  extends FabVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FabRoot = withProvider<HTMLButtonElement, FabRootProps>(Primitive.button, "root");

export interface FabIconProps extends InternalIconProps {}

export const FabIcon = withContext<HTMLButtonElement, FabIconProps>(InternalIcon, "icon");

export interface FabLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const FabLabel = withContext<HTMLSpanElement, FabLabelProps>(Primitive.span, "label");

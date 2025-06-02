import {
  floatingActionButton,
  type FloatingActionButtonVariantProps,
} from "@seed-design/css/recipes/floating-action-button";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { withProvider, withContext } = createSlotRecipeContext(floatingActionButton);

////////////////////////////////////////////////////////////////////////////////////

export interface FloatingActionButtonRootProps
  extends FloatingActionButtonVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FloatingActionButtonRoot = withProvider<
  HTMLButtonElement,
  FloatingActionButtonRootProps
>(Primitive.button, "root");

export interface FloatingActionButtonIconProps extends InternalIconProps {}

export const FloatingActionButtonIcon = withContext<
  HTMLButtonElement,
  FloatingActionButtonIconProps
>(InternalIcon, "icon");

export interface FloatingActionButtonLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FloatingActionButtonLabel = withContext<
  HTMLSpanElement,
  FloatingActionButtonLabelProps
>(Primitive.span, "label");

import { chip, type ChipVariantProps } from "@seed-design/css/recipes/chip";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withIconRequired } from "../Icon/Icon";

const { withProvider, withContext } = createSlotRecipeContext(chip);

////////////////////////////////////////////////////////////////////////////////////

export interface ChipRootProps
  extends PrimitiveProps,
    ChipVariantProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ChipRoot = withIconRequired(
  withProvider<HTMLButtonElement, ChipRootProps>(Primitive.button, "root"),
  (props: ChipRootProps) => props.layout === "iconOnly",
);
ChipRoot.displayName = "Chip.Root";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const ChipLabel = withContext<HTMLSpanElement, ChipLabelProps>(Primitive.span, "label");
ChipLabel.displayName = "Chip.Label";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipPrefixIconProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}
export const ChipPrefixIcon = withContext<HTMLDivElement, ChipPrefixIconProps>(
  Primitive.div,
  "prefixIcon",
);
ChipPrefixIcon.displayName = "Chip.PrefixIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipPrefixAvatarProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ChipPrefixAvatar = withContext<HTMLDivElement, ChipPrefixAvatarProps>(
  Primitive.div,
  "prefixAvatar",
);
ChipPrefixAvatar.displayName = "Chip.PrefixAvatar";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipSuffixIconProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}
export const ChipSuffixIcon = withContext<HTMLDivElement, ChipSuffixIconProps>(
  Primitive.div,
  "suffixIcon",
);
ChipSuffixIcon.displayName = "Chip.SuffixIcon";

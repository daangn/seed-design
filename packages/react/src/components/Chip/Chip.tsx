import { chip, type ChipVariantProps } from "@ride-developer/css/recipes/chip";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withIconRequired } from "../Icon/Icon";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { useCheckboxContext } from "@seed-design/react-checkbox";
import { useRadioGroupItemContext } from "@seed-design/react-radio-group";

const { withProvider, withContext } = createSlotRecipeContext(chip);
const withStateProps = createWithStateProps([
  { useContext: useCheckboxContext, strict: false },
  { useContext: useRadioGroupItemContext, strict: false },
]);

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

export const ChipLabel = withContext<HTMLSpanElement, ChipLabelProps>(
  withStateProps(Primitive.span),
  "label",
);
ChipLabel.displayName = "Chip.Label";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipPrefixIconProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}
export const ChipPrefixIcon = withContext<HTMLDivElement, ChipPrefixIconProps>(
  withStateProps(Primitive.div),
  "prefixIcon",
);
ChipPrefixIcon.displayName = "Chip.PrefixIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipPrefixAvatarProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ChipPrefixAvatar = withContext<HTMLDivElement, ChipPrefixAvatarProps>(
  withStateProps(Primitive.div),
  "prefixAvatar",
);
ChipPrefixAvatar.displayName = "Chip.PrefixAvatar";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipSuffixIconProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}
export const ChipSuffixIcon = withContext<HTMLDivElement, ChipSuffixIconProps>(
  withStateProps(Primitive.div),
  "suffixIcon",
);
ChipSuffixIcon.displayName = "Chip.SuffixIcon";

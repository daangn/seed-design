import { chip, type ChipVariantProps } from "@seed-design/css/recipes/chip";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withScaleFeedback } from "../../utils/withScaleFeedback";
import { withIconRequired } from "../Icon/Icon";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { Checkbox as CheckboxPrimitive, useCheckboxContext } from "@seed-design/react-checkbox";
import {
  RadioGroup as RadioGroupPrimitive,
  useRadioGroupItemContext,
} from "@seed-design/react-radio-group";

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
  withScaleFeedback(withProvider<HTMLButtonElement, ChipRootProps>(Primitive.button, "root")),
  (props: ChipRootProps) => props.layout === "iconOnly",
);
ChipRoot.displayName = "Chip.Root";

export interface ChipToggleProps extends ChipVariantProps, CheckboxPrimitive.RootProps {}

export const ChipToggle = withIconRequired(
  withScaleFeedback(
    withProvider<HTMLLabelElement, ChipToggleProps>(CheckboxPrimitive.Root, "root"),
  ),
  (props: ChipToggleProps) => props.layout === "iconOnly",
);
ChipToggle.displayName = "Chip.Toggle";

export interface ChipRadioRootProps extends RadioGroupPrimitive.RootProps {}

export const ChipRadioRoot = RadioGroupPrimitive.Root;

export interface ChipRadioItemProps extends ChipVariantProps, RadioGroupPrimitive.ItemProps {}

export const ChipRadioItem = withIconRequired(
  withScaleFeedback(
    withProvider<HTMLLabelElement, ChipRadioItemProps>(RadioGroupPrimitive.Item, "root"),
  ),
  (props: ChipRadioItemProps) => props.layout === "iconOnly",
);
ChipRadioItem.displayName = "Chip.RadioItem";

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

import { selectBox } from "@seed-design/css/recipes/select-box";
import { selectBoxGroup } from "@seed-design/css/recipes/select-box-group";
import { Checkbox as CheckboxPrimitive, useCheckboxContext } from "@seed-design/react-checkbox";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { withProvider: withGroupProvider } = createRecipeContext(selectBoxGroup);
const { withProvider, withContext } = createSlotRecipeContext(selectBox);
const withStateProps = createWithStateProps([useCheckboxContext]);

export interface CheckSelectBoxGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * CheckSelectBoxGroup is a simple div wrapper for future extensibility.
 * It does not have spacing by default, nesting <Stack> under it is recommended.
 */
export const CheckSelectBoxGroup = withGroupProvider<HTMLDivElement, CheckSelectBoxGroupProps>(
  forwardRef<HTMLDivElement, CheckSelectBoxGroupProps>((props, ref) => (
    <Primitive.div ref={ref} role="group" {...props} />
  )),
);

export interface CheckSelectBoxRootProps extends CheckboxPrimitive.RootProps {}

export const CheckSelectBoxRoot = withProvider<HTMLLabelElement, CheckSelectBoxRootProps>(
  CheckboxPrimitive.Root,
  "root",
);

export interface CheckSelectBoxContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const CheckSelectBoxContent = withContext<HTMLDivElement, CheckSelectBoxContentProps>(
  withStateProps(Primitive.div),
  "content",
);

export interface CheckSelectBoxLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const CheckSelectBoxLabel = withContext<HTMLSpanElement, CheckSelectBoxLabelProps>(
  withStateProps(Primitive.span),
  "label",
);

export interface CheckSelectBoxDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const CheckSelectBoxDescription = withContext<
  HTMLSpanElement,
  CheckSelectBoxDescriptionProps
>(withStateProps(Primitive.span), "description");

export interface CheckSelectBoxControlProps extends CheckboxPrimitive.ControlProps {}

export const CheckSelectBoxControl = withContext<HTMLDivElement, CheckSelectBoxControlProps>(
  CheckboxPrimitive.Control,
  "checkboxControl",
);

export interface CheckSelectBoxIconProps extends InternalIconProps {}

export const CheckSelectBoxIcon = withContext<SVGSVGElement, CheckSelectBoxIconProps>(
  withStateProps(InternalIcon),
  "checkboxIcon",
);

export interface CheckSelectBoxHiddenInputProps extends CheckboxPrimitive.HiddenInputProps {}

export const CheckSelectBoxHiddenInput = CheckboxPrimitive.HiddenInput;

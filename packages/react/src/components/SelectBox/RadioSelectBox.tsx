import { selectBox } from "@seed-design/css/recipes/select-box";
import { selectBoxGroup } from "@seed-design/css/recipes/select-box-group";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  RadioGroup as RadioGroupPrimitive,
  useRadioGroupItemContext,
} from "@seed-design/react-radio-group";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { withProvider: withGroupProvider } = createRecipeContext(selectBoxGroup);
const { withProvider, withContext } = createSlotRecipeContext(selectBox);
const withStateProps = createWithStateProps([useRadioGroupItemContext]);

export interface RadioSelectBoxRootProps extends RadioGroupPrimitive.RootProps {}

export const RadioSelectBoxRoot = withGroupProvider<HTMLDivElement, RadioSelectBoxRootProps>(
  RadioGroupPrimitive.Root,
);

export interface RadioSelectBoxItemProps extends RadioGroupPrimitive.ItemProps {}

export const RadioSelectBoxItem = withProvider<HTMLLabelElement, RadioSelectBoxItemProps>(
  RadioGroupPrimitive.Item,
  "root",
);

export interface RadioSelectBoxContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioSelectBoxContent = withContext<HTMLDivElement, RadioSelectBoxContentProps>(
  withStateProps(Primitive.div),
  "content",
);

export interface RadioSelectBoxLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const RadioSelectBoxLabel = withContext<HTMLSpanElement, RadioSelectBoxLabelProps>(
  withStateProps(Primitive.span),
  "label",
);

export interface RadioSelectBoxDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const RadioSelectBoxDescription = withContext<
  HTMLSpanElement,
  RadioSelectBoxDescriptionProps
>(withStateProps(Primitive.span), "description");

export interface RadioSelectBoxControlProps extends RadioGroupPrimitive.ItemControlProps {}

export const RadioSelectBoxControl = withContext<HTMLDivElement, RadioSelectBoxControlProps>(
  RadioGroupPrimitive.ItemControl,
  "radioControl",
);

export interface RadioSelectBoxIconProps extends InternalIconProps {}

export const RadioSelectBoxIcon = withContext<SVGSVGElement, RadioSelectBoxIconProps>(
  withStateProps(InternalIcon),
  "radioIcon",
);

export interface RadioSelectBoxHiddenInputProps extends RadioGroupPrimitive.ItemHiddenInputProps {}

export const RadioSelectBoxHiddenInput = RadioGroupPrimitive.ItemHiddenInput;

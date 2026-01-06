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

const { withContext: withGroupContext } = createRecipeContext(selectBoxGroup);
const { withContext, withProvider } = createSlotRecipeContext(selectBox);
const withStateProps = createWithStateProps([useRadioGroupItemContext]);

export interface RadioSelectBoxRootProps extends RadioGroupPrimitive.RootProps {}

export const RadioSelectBoxRoot = withGroupContext<HTMLDivElement, RadioSelectBoxRootProps>(
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
  withStateProps(Primitive.div),
  "label",
);

export interface RadioSelectBoxDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const RadioSelectBoxDescription = withContext<
  HTMLSpanElement,
  RadioSelectBoxDescriptionProps
>(withStateProps(Primitive.div), "description");

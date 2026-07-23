import {
  segmentedControl,
  type SegmentedControlVariantProps,
} from "@seed-design/css/recipes/segmented-control";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { SegmentedControl as SegmentedControlPrimitive } from "@seed-design/react-segmented-control";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withPressScale } from "../../utils/pressScale";

const { withProvider, withContext } = createSlotRecipeContext(segmentedControl);

export interface SegmentedControlRootProps
  extends SegmentedControlVariantProps,
    SegmentedControlPrimitive.RootProps {}

export const SegmentedControlRoot = withProvider<HTMLDivElement, SegmentedControlRootProps>(
  SegmentedControlPrimitive.Root,
  "root",
);

export interface SegmentedControlIndicatorProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SegmentedControlIndicator = withContext<
  HTMLDivElement,
  SegmentedControlIndicatorProps
>(Primitive.div, "indicator");

export interface SegmentedControlItemProps extends SegmentedControlPrimitive.ItemProps {}

export const SegmentedControlItem = withPressScale(
  withContext<HTMLLabelElement, SegmentedControlItemProps>(SegmentedControlPrimitive.Item, "item"),
);
SegmentedControlItem.displayName = "SegmentedControlItem";

export interface SegmentedControlItemHiddenInputProps
  extends SegmentedControlPrimitive.ItemHiddenInputProps {}

export const SegmentedControlItemHiddenInput = SegmentedControlPrimitive.ItemHiddenInput;

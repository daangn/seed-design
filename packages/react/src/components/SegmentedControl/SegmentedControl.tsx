import {
  segmentedControl,
  type SegmentedControlVariantProps,
} from "@ride-developer/css/recipes/segmented-control";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import { SegmentedControl as SegmentedControlPrimitive } from "@ride-developer/react-segmented-control";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

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

export const SegmentedControlItem = withContext<HTMLLabelElement, SegmentedControlItemProps>(
  SegmentedControlPrimitive.Item,
  "item",
);

export interface SegmentedControlItemHiddenInputProps
  extends SegmentedControlPrimitive.ItemHiddenInputProps {}

export const SegmentedControlItemHiddenInput = SegmentedControlPrimitive.ItemHiddenInput;

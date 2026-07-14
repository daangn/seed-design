import {
  segmentedControl,
  type SegmentedControlVariantProps,
} from "@seed-design/css/recipes/segmented-control";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { SegmentedControl as SegmentedControlPrimitive } from "@seed-design/react-segmented-control";
import clsx from "clsx";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { wrapSlotChildren } from "../../utils/wrapSlotChildren";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(segmentedControl);

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

export const SegmentedControlItem = forwardRef<HTMLLabelElement, SegmentedControlItemProps>(
  ({ className, children, ...props }, ref) => {
    const classNames = useClassNames();

    return (
      <SegmentedControlPrimitive.Item
        ref={ref}
        className={clsx(classNames.item, className)}
        {...props}
      >
        {/* layout layer — scales the item's content as a whole on press while the
            pressed background stays on item. With asChild it is injected inside the
            consumer's element instead. */}
        {wrapSlotChildren(props.asChild, children, (layoutChildren) => (
          <div className={classNames.itemLayout}>{layoutChildren}</div>
        ))}
      </SegmentedControlPrimitive.Item>
    );
  },
);
SegmentedControlItem.displayName = "SegmentedControlItem";

export interface SegmentedControlItemHiddenInputProps
  extends SegmentedControlPrimitive.ItemHiddenInputProps {}

export const SegmentedControlItemHiddenInput = SegmentedControlPrimitive.ItemHiddenInput;

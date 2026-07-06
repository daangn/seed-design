"use client";

import {
  Select as SelectPrimitive,
  useSelectContext,
  useSelectItemContext,
} from "@seed-design/react-select";
import { mergeProps } from "@seed-design/dom-utils";
import { select, type SelectVariantProps } from "@seed-design/css/recipes/select";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(select);

const withStateProps = createWithStateProps([useSelectContext]);
const withItemStateProps = createWithStateProps([useSelectItemContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectRootProps extends SelectVariantProps, SelectPrimitive.RootProps {}

export const SelectRoot = withRootProvider<SelectRootProps>(SelectPrimitive.Root);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectTriggerProps extends SelectPrimitive.TriggerProps {}

export const SelectTrigger = withContext<HTMLButtonElement, SelectTriggerProps>(
  SelectPrimitive.Trigger,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectValueProps extends SelectPrimitive.ValueProps {}

export const SelectValue = withContext<HTMLSpanElement, SelectValueProps>(
  withStateProps(SelectPrimitive.Value),
  "value",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectPlaceholderProps extends SelectPrimitive.PlaceholderProps {}

export const SelectPlaceholder = withContext<HTMLSpanElement, SelectPlaceholderProps>(
  withStateProps(SelectPrimitive.Placeholder),
  "placeholder",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectPrefixIconProps extends InternalIconProps {}

export const SelectPrefixIcon = withContext<SVGSVGElement, SelectPrefixIconProps>(
  withStateProps(InternalIcon),
  "prefixIcon",
);

export interface SelectSuffixIconProps extends InternalIconProps {}

export const SelectSuffixIcon = withContext<SVGSVGElement, SelectSuffixIconProps>(
  withStateProps(InternalIcon),
  "suffixIcon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectPositionerProps
  extends SelectPrimitive.PositionerProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SelectPositioner = React.forwardRef<HTMLDivElement, SelectPositionerProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();

    return (
      <SelectPrimitive.Positioner
        ref={ref}
        className={clsx(classNames.positioner, className)}
        {...props}
      />
    );
  },
);
SelectPositioner.displayName = "SelectPositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectContentProps extends SelectPrimitive.ContentProps {}

export const SelectContent = withContext<HTMLDivElement, SelectContentProps>(
  SelectPrimitive.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectScrollAreaProps extends SelectPrimitive.ScrollAreaProps {}

export const SelectScrollArea = withContext<HTMLDivElement, SelectScrollAreaProps>(
  SelectPrimitive.ScrollArea,
  "scrollArea",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectGroupProps extends SelectPrimitive.GroupProps {}

export const SelectGroup = withContext<HTMLDivElement, SelectGroupProps>(
  SelectPrimitive.Group,
  "group",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectGroupLabelProps extends SelectPrimitive.GroupLabelProps {}

export const SelectGroupLabel = withContext<HTMLDivElement, SelectGroupLabelProps>(
  SelectPrimitive.GroupLabel,
  "groupLabel",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemProps extends SelectPrimitive.ItemProps {}

export const SelectItem = withContext<HTMLDivElement, SelectItemProps>(
  SelectPrimitive.Item,
  "item",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemBodyProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const SelectItemBody = withContext<HTMLDivElement, SelectItemBodyProps>(
  withItemStateProps(Primitive.div),
  "itemBody",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SelectItemLabel = withContext<HTMLSpanElement, SelectItemLabelProps>(
  withItemStateProps(Primitive.span),
  "itemLabel",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SelectItemDescription = withContext<HTMLSpanElement, SelectItemDescriptionProps>(
  withItemStateProps(Primitive.span),
  "itemDescription",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemIndicatorProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * The icon to display when the item is selected.
   */
  selected: React.ReactNode;

  /**
   * The icon to display when the item is not selected.
   */
  unselected?: React.ReactNode;
}

export const SelectItemIndicator = React.forwardRef<SVGSVGElement, SelectItemIndicatorProps>(
  ({ selected: selectedSvg, unselected: unselectedSvg, ...otherProps }, ref) => {
    const { isSelected, stateProps } = useSelectItemContext();
    const classNames = useClassNames();

    const mergedProps = mergeProps(
      stateProps,
      { className: classNames.itemIndicator },
      otherProps as React.HTMLAttributes<HTMLElement>,
    );

    const svg = isSelected ? selectedSvg : unselectedSvg;
    if (!svg) return null;

    return <InternalIcon ref={ref} svg={svg} {...mergedProps} />;
  },
);
SelectItemIndicator.displayName = "SelectItemIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectHiddenSelectProps extends SelectPrimitive.HiddenSelectProps {}

export const SelectHiddenSelect = SelectPrimitive.HiddenSelect;

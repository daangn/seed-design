"use client";

import {
  Select as SelectPrimitive,
  useSelectContext,
  useSelectItemContext,
} from "@seed-design/react-select";
import { useFieldContext } from "@seed-design/react-field";
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

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, ...otherProps }, ref) => {
    const classNames = useClassNames();
    const fieldContext = useFieldContext({ strict: false });

    // Pull only the field's labelledby/describedby: `useSelect` owns the
    // combobox's aria-invalid/required and native disabled, so we don't merge
    // those from the field (avoids duplicate ownership and aria-disabled on top
    // of the native disabled button).
    const mergedProps = mergeProps(
      fieldContext
        ? {
            "aria-labelledby": fieldContext.inputAriaAttributes["aria-labelledby"],
            "aria-describedby": fieldContext.inputAriaAttributes["aria-describedby"],
          }
        : {},
      otherProps,
    );

    if (
      process.env.NODE_ENV !== "production" &&
      !fieldContext &&
      !otherProps["aria-label"] &&
      !otherProps["aria-labelledby"]
    ) {
      console.warn(
        "SelectTrigger: Please provide `aria-label` or `aria-labelledby` for accessibility, or put `SelectTrigger` inside a `Field` where a `FieldLabel` is provided.",
      );
    }

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={clsx(classNames.root, className)}
        {...mergedProps}
      />
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

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

export interface SelectPrefixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SelectPrefixText = withContext<HTMLSpanElement, SelectPrefixTextProps>(
  withStateProps(Primitive.span),
  "prefixText",
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

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, ...otherProps }, ref) => {
    const classNames = useClassNames();
    const fieldContext = useFieldContext({ strict: false });

    // Label the listbox popup with the same field label (APG combobox pattern).
    const labelledby = fieldContext?.inputAriaAttributes["aria-labelledby"];

    const mergedProps = mergeProps(labelledby ? { "aria-labelledby": labelledby } : {}, otherProps);

    return (
      <SelectPrimitive.Content
        ref={ref}
        className={clsx(classNames.content, className)}
        {...mergedProps}
      />
    );
  },
);
SelectContent.displayName = "SelectContent";

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

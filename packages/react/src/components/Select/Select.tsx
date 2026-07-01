"use client";

import {
  Select as SelectPrimitive,
  useSelectContext,
  useSelectItemContext,
} from "@seed-design/react-select";
import { select, type SelectVariantProps } from "@seed-design/css/recipes/select";
import {
  selectTrigger,
  type SelectTriggerVariantProps,
} from "@seed-design/css/recipes/select-trigger";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { ClassNamesProvider, withContext, useClassNames } = createSlotRecipeContext(select);
const { ClassNamesProvider: TriggerClassNamesProvider, withContext: withTriggerContext } =
  createSlotRecipeContext(selectTrigger);

const withStateProps = createWithStateProps([useSelectContext]);
const withItemStateProps = createWithStateProps([useSelectItemContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectRootProps
  extends SelectVariantProps,
    SelectTriggerVariantProps,
    SelectPrimitive.RootProps {}

export const SelectRoot = (props: SelectRootProps) => {
  const [variantProps, otherProps] = select.splitVariantProps(props);
  const classNames = select(variantProps);
  const triggerClassNames = selectTrigger(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <TriggerClassNamesProvider value={triggerClassNames}>
        <SelectPrimitive.Root {...otherProps} />
      </TriggerClassNamesProvider>
    </ClassNamesProvider>
  );
};

////////////////////////////////////////////////////////////////////////////////////

export interface SelectTriggerProps extends SelectPrimitive.TriggerProps {}

export const SelectTrigger = withTriggerContext<HTMLButtonElement, SelectTriggerProps>(
  SelectPrimitive.Trigger,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectValueProps extends SelectPrimitive.ValueProps {}

export const SelectValue = withTriggerContext<HTMLSpanElement, SelectValueProps>(
  withStateProps(SelectPrimitive.Value),
  "value",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectPlaceholderProps extends SelectPrimitive.PlaceholderProps {}

export const SelectPlaceholder = withTriggerContext<HTMLSpanElement, SelectPlaceholderProps>(
  withStateProps(SelectPrimitive.Placeholder),
  "placeholder",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectPrefixIconProps extends InternalIconProps {}

export const SelectPrefixIcon = withTriggerContext<SVGSVGElement, SelectPrefixIconProps>(
  withStateProps(InternalIcon),
  "prefixIcon",
);

export interface SelectPrefixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SelectPrefixText = withTriggerContext<HTMLSpanElement, SelectPrefixTextProps>(
  withStateProps(Primitive.span),
  "prefixText",
);

export interface SelectSuffixIconProps extends InternalIconProps {}

export const SelectSuffixIcon = withTriggerContext<SVGSVGElement, SelectSuffixIconProps>(
  withStateProps(InternalIcon),
  "suffixIcon",
);

export interface SelectSuffixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SelectSuffixText = withTriggerContext<HTMLSpanElement, SelectSuffixTextProps>(
  withStateProps(Primitive.span),
  "suffixText",
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

export interface SelectItemIndicatorProps extends SelectPrimitive.ItemIndicatorProps {}

export const SelectItemIndicator = withContext<HTMLSpanElement, SelectItemIndicatorProps>(
  withItemStateProps(SelectPrimitive.ItemIndicator),
  "itemIndicator",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectHiddenSelectProps extends SelectPrimitive.HiddenSelectProps {}

export const SelectHiddenSelect = SelectPrimitive.HiddenSelect;

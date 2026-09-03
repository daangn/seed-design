"use client";

import {
  Select as SelectPrimitive,
  useSelectContext,
  useSelectItemContext,
} from "@seed-design/react-select";
import { useFieldContext } from "@seed-design/react-field";
import { mergeProps } from "@seed-design/dom-utils";
import { select, type SelectVariantProps } from "@seed-design/css/recipes/select";
import {
  selectTrigger,
  type SelectTriggerVariantProps,
} from "@seed-design/css/recipes/select-trigger";
import { selectItem, type SelectItemVariantProps } from "@seed-design/css/recipes/select-item";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { clsx } from "cn";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { splitMultipleVariantsProps } from "../../utils/splitMultipleVariantsProps";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

// A select-only combobox spans three specs — the trigger, the floating listbox
// container, and the option rows — each with its own independent states and its own
// variant map. `SelectRoot` seeds defaults for all three, but only the container
// resolves there, since its slots are spread across the portal subtree with no
// single element to own them. The trigger and each option row resolve their own
// recipe, so a per-instance variant can override the root's default.
const {
  ClassNamesProvider: TriggerClassNamesProvider,
  PropsProvider: TriggerPropsProvider,
  useProps: useTriggerProps,
  withContext: withTriggerContext,
  useClassNames: useTriggerClassNames,
} = createSlotRecipeContext(selectTrigger);

const {
  ClassNamesProvider: ContentClassNamesProvider,
  withContext: withContentContext,
  useClassNames: useContentClassNames,
} = createSlotRecipeContext(select);

const {
  ClassNamesProvider: ItemClassNamesProvider,
  PropsProvider: ItemPropsProvider,
  useProps: useItemProps,
  withContext: withItemContext,
  useClassNames: useItemClassNames,
} = createSlotRecipeContext(selectItem);

const withStateProps = createWithStateProps([useSelectContext]);
const withItemStateProps = createWithStateProps([useSelectItemContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectRootProps
  extends SelectVariantProps,
    SelectTriggerVariantProps,
    SelectItemVariantProps,
    SelectPrimitive.RootProps {}

// NOTE: `gutter` and `overflowPadding` are specified in Rootage (`select.yaml`,
// both `$dimension.x2`) and generated into `@seed-design/css`, but nothing reads
// them: floating-ui's `offset`/`shift` take numbers, not CSS custom properties,
// so the headless layer falls back to its own `8`. That default stays
// design-system-agnostic on purpose — this layer is the one that owns the
// Rootage binding, so seed the spec values from here when they need to win,
// the way `HelpBubbleRoot` passes `gutter` through `defaultProps`.
export const SelectRoot = (props: SelectRootProps) => {
  const [
    {
      select: contentVariantProps,
      selectTrigger: triggerVariantProps,
      selectItem: itemVariantProps,
    },
    otherProps,
  ] = splitMultipleVariantsProps(props, { select, selectTrigger, selectItem });

  const contentClassNames = select(contentVariantProps);

  return (
    <ContentClassNamesProvider value={contentClassNames}>
      <TriggerPropsProvider value={triggerVariantProps}>
        <ItemPropsProvider value={itemVariantProps}>
          <SelectPrimitive.Root {...otherProps} />
        </ItemPropsProvider>
      </TriggerPropsProvider>
    </ContentClassNamesProvider>
  );
};

////////////////////////////////////////////////////////////////////////////////////

export interface SelectTriggerProps
  extends SelectTriggerVariantProps,
    SelectPrimitive.TriggerProps {}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, ...props }, ref) => {
    const [variantProps, otherProps] = selectTrigger.splitVariantProps(props);
    const rootProps = useTriggerProps();

    const classNames = selectTrigger({ ...rootProps, ...variantProps });
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
      <TriggerClassNamesProvider value={classNames}>
        <SelectPrimitive.Trigger
          ref={ref}
          className={clsx(classNames.root, className)}
          {...mergedProps}
        />
      </TriggerClassNamesProvider>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

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

export interface SelectPrefixIconProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * The fallback icon shown when the current selection supplies no icon of its
   * own. While exactly one item is selected, that item's `icon` takes over the
   * slot; this fallback shows when that item has no icon — and for empty or
   * multi selections. Named `fallback` (not `svg`) because a selected item's own
   * icon outranks it, so what you pass here may not be what renders.
   */
  fallback?: React.ReactNode;
}

export const SelectPrefixIcon = React.forwardRef<SVGSVGElement, SelectPrefixIconProps>(
  ({ fallback, className, ...otherProps }, ref) => {
    const { selectedItem, stateProps } = useSelectContext();
    const classNames = useTriggerClassNames();

    const svg = selectedItem?.icon ?? fallback;
    if (!svg) return null;

    return (
      <InternalIcon
        ref={ref}
        svg={svg}
        className={clsx(classNames.prefixIcon, className)}
        {...stateProps}
        {...otherProps}
      />
    );
  },
);
SelectPrefixIcon.displayName = "SelectPrefixIcon";

export interface SelectSuffixIconProps extends InternalIconProps {}

export const SelectSuffixIcon = withTriggerContext<SVGSVGElement, SelectSuffixIconProps>(
  withStateProps(InternalIcon),
  "suffixIcon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectPositionerProps extends SelectPrimitive.PositionerProps {}

export const SelectPositioner = React.forwardRef<HTMLDivElement, SelectPositionerProps>(
  ({ className, ...props }, ref) => {
    const classNames = useContentClassNames();

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
    const classNames = useContentClassNames();
    const fieldContext = useFieldContext({ strict: false });

    // Label the listbox popup with the same field label (APG combobox pattern).
    const mergedProps = mergeProps(
      fieldContext
        ? { "aria-labelledby": fieldContext.inputAriaAttributes["aria-labelledby"] }
        : {},
      otherProps,
    );

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

export interface SelectScrollAreaProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SelectScrollArea = withContentContext<HTMLDivElement, SelectScrollAreaProps>(
  Primitive.div,
  "scrollArea",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectGroupProps extends SelectPrimitive.GroupProps {}

export const SelectGroup = withContentContext<HTMLDivElement, SelectGroupProps>(
  SelectPrimitive.Group,
  "group",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectGroupLabelProps extends SelectPrimitive.GroupLabelProps {}

export const SelectGroupLabel = withContentContext<HTMLDivElement, SelectGroupLabelProps>(
  SelectPrimitive.GroupLabel,
  "groupLabel",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemProps
  extends SelectItemVariantProps,
    Omit<SelectPrimitive.ItemProps, "icon"> {
  /**
   * The option's prefix icon. Forwarded to the headless item's position-agnostic
   * `icon`, which registers it for the trigger prefix slot and exposes it to the
   * styled `ItemPrefixIcon` rendered in the row.
   */
  prefixIcon?: React.ReactNode;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ prefixIcon, className, ...props }, ref) => {
    const [variantProps, otherProps] = selectItem.splitVariantProps(props);
    const rootProps = useItemProps();

    const classNames = selectItem({ ...rootProps, ...variantProps });

    return (
      <ItemClassNamesProvider value={classNames}>
        <SelectPrimitive.Item
          ref={ref}
          icon={prefixIcon}
          {...otherProps}
          className={clsx(classNames.root, className)}
        />
      </ItemClassNamesProvider>
    );
  },
);
SelectItem.displayName = "SelectItem";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemPrefixIconProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Overrides the icon to render. Defaults to the item's own `icon` (read
   * from item context), so the row shows the icon the item registered.
   */
  svg?: React.ReactNode;
}

export const SelectItemPrefixIcon = React.forwardRef<SVGSVGElement, SelectItemPrefixIconProps>(
  ({ svg: svgOverride, className, ...otherProps }, ref) => {
    const { icon, stateProps } = useSelectItemContext();
    const classNames = useItemClassNames();

    const svg = svgOverride ?? icon;
    if (!svg) return null;

    return (
      <InternalIcon
        ref={ref}
        svg={svg}
        className={clsx(classNames.prefixIcon, className)}
        {...stateProps}
        {...otherProps}
      />
    );
  },
);
SelectItemPrefixIcon.displayName = "SelectItemPrefixIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemBodyProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const SelectItemBody = withItemContext<HTMLDivElement, SelectItemBodyProps>(
  withItemStateProps(Primitive.div),
  "body",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SelectItemLabel = React.forwardRef<HTMLSpanElement, SelectItemLabelProps>(
  ({ children, className, ...otherProps }, ref) => {
    const { label, stateProps } = useSelectItemContext();
    const classNames = useItemClassNames();

    // stateProps stays because the label's disabled style targets its own
    // `data-disabled`.
    return (
      <Primitive.span
        ref={ref}
        className={clsx(classNames.label, className)}
        {...stateProps}
        {...otherProps}
      >
        {children ?? label}
      </Primitive.span>
    );
  },
);
SelectItemLabel.displayName = "SelectItemLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SelectItemDescription = withItemContext<HTMLSpanElement, SelectItemDescriptionProps>(
  withItemStateProps(Primitive.span),
  "description",
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
  ({ selected: selectedSvg, unselected: unselectedSvg, className, ...otherProps }, ref) => {
    const { isSelected, stateProps } = useSelectItemContext();
    const classNames = useItemClassNames();

    const svg = isSelected ? selectedSvg : unselectedSvg;
    if (!svg) return null;

    return (
      <InternalIcon
        ref={ref}
        svg={svg}
        className={clsx(classNames.indicator, className)}
        {...stateProps}
        {...otherProps}
      />
    );
  },
);
SelectItemIndicator.displayName = "SelectItemIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectHiddenSelectProps extends SelectPrimitive.HiddenSelectProps {}

export const SelectHiddenSelect = React.forwardRef<HTMLSelectElement, SelectHiddenSelectProps>(
  (props, ref) => {
    const fieldContext = useFieldContext({ strict: false });

    // The field label's `htmlFor` targets the field input id. Carrying that id on
    // the hidden native select — a labelable element whose label activation only
    // focuses, never opens anything — makes label clicks reach the trigger through
    // the hidden select's focus redirect. Associating the label with the trigger
    // button instead would forward label clicks as activation and open the listbox.
    return <SelectPrimitive.HiddenSelect ref={ref} id={fieldContext?.inputProps.id} {...props} />;
  },
);
SelectHiddenSelect.displayName = "SelectHiddenSelect";

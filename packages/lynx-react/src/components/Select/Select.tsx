import * as React from "@lynx-js/react";
import clsx from "clsx";

import {
  PopoverBackdrop,
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
  type PopoverContentProps,
  type PopoverPositionerProps,
} from "@lynx-js/lynx-ui-popover";
import { select, type SelectVariantProps } from "@seed-design/lynx-css/recipes/select";
import { selectItem, type SelectItemVariantProps } from "@seed-design/lynx-css/recipes/select-item";
import {
  selectTrigger,
  type SelectTriggerVariantProps,
} from "@seed-design/lynx-css/recipes/select-trigger";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";

type SelectSize = NonNullable<SelectVariantProps["size"]>;
type PublicSelectTriggerVariantProps = Omit<
  SelectTriggerVariantProps,
  "open" | "pressed" | "disabled" | "invalid" | "readOnly"
>;
type PublicSelectItemVariantProps = Omit<
  SelectItemVariantProps,
  "pressed" | "disabled" | "selected"
>;

export interface SelectOption {
  value: string;
  textValue: string;
  label?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  disabled?: boolean;
}

interface SelectContextValue {
  values: string[];
  open: boolean;
  multiple: boolean;
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  size: SelectSize;
  formatValue?: (options: SelectOption[]) => React.ReactNode;
  options: ReadonlyMap<string, SelectOption>;
  triggerWidth: number | null;
  setTriggerWidth: (width: number) => void;
  selectItem: (value: string) => void;
}

type LayoutChangeHandler = NonNullable<LynxViewProps["bindlayoutchange"]>;

function getLayoutWidth(event: Parameters<LayoutChangeHandler>[0]): number | null {
  const eventWithWidth = event as Parameters<LayoutChangeHandler>[0] & { width?: number };
  const width = event.detail?.width ?? event.params?.width ?? eventWithWidth.width;

  if (typeof width !== "number" || !Number.isFinite(width)) return null;
  return Math.max(0, width);
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext(consumer: string): SelectContextValue {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <SelectRoot/>.`);
  return context;
}

interface SelectItemContextValue extends SelectOption {
  selected: boolean;
  disabled: boolean;
  pressed: boolean;
}

const SelectItemContext = React.createContext<SelectItemContextValue | null>(null);

function useSelectItemContext(consumer: string): SelectItemContextValue {
  const context = React.useContext(SelectItemContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <SelectItem/>.`);
  return context;
}

const { ClassNamesProvider: ContentClassNamesProvider, useClassNames: useContentClassNames } =
  createSlotRecipeContext(select);
const { ClassNamesProvider: TriggerClassNamesProvider, useClassNames: useTriggerClassNames } =
  createSlotRecipeContext(selectTrigger);
const { ClassNamesProvider: ItemClassNamesProvider, useClassNames: useItemClassNames } =
  createSlotRecipeContext(selectItem);

function getResolvedOptions(context: SelectContextValue): SelectOption[] {
  const options: SelectOption[] = [];
  for (const value of context.values) {
    const option = context.options.get(value);
    if (option) options.push(option);
  }
  return options;
}

function getValueText(context: SelectContextValue): React.ReactNode | null {
  const options = getResolvedOptions(context);
  if (options.length === 0) return null;
  return context.formatValue?.(options) ?? options.map((option) => option.textValue).join(", ");
}

////////////////////////////////////////////////////////////////////////////////////

export interface SelectRootProps
  extends Omit<SelectVariantProps, "size">,
    Omit<PublicSelectTriggerVariantProps, "size">,
    Omit<PublicSelectItemVariantProps, "size"> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  multiple?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  formatValue?: (options: SelectOption[]) => React.ReactNode;
  children?: React.ReactNode;
  options: readonly SelectOption[];
  size?: SelectSize;
}

export function SelectRoot(props: SelectRootProps) {
  const {
    children,
    options,
    value: valueProp,
    defaultValue = [],
    onValueChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    multiple = false,
    disabled = false,
    invalid = false,
    readOnly = false,
    formatValue,
    size = "large",
  } = props;
  const [rawValues, setValues] = useControllableState<string[]>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const handleVisibleChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen && (disabled || readOnly)) return;
      setOpen(nextOpen);
    },
    [disabled, readOnly, setOpen],
  );
  const values = multiple ? rawValues : rawValues.slice(0, 1);
  const optionsByValue = React.useMemo(
    () => new Map<string, SelectOption>(options.map((option) => [option.value, option] as const)),
    [options],
  );
  const [triggerWidth, setTriggerWidth] = React.useState<number | null>(null);

  const selectItem = React.useCallback(
    (itemValue: string) => {
      if (disabled || readOnly) return;
      const nextValues = multiple
        ? values.includes(itemValue)
          ? values.filter((value) => value !== itemValue)
          : [...values, itemValue]
        : [itemValue];
      setValues(nextValues);
      if (!multiple) setOpen(false);
    },
    [disabled, multiple, readOnly, setOpen, setValues, values],
  );

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      values,
      open,
      multiple,
      disabled,
      invalid,
      readOnly,
      size,
      formatValue,
      options: optionsByValue,
      triggerWidth,
      setTriggerWidth,
      selectItem,
    }),
    [
      disabled,
      formatValue,
      invalid,
      multiple,
      open,
      optionsByValue,
      readOnly,
      selectItem,
      size,
      triggerWidth,
      values,
    ],
  );
  const classes = select({ size });

  return (
    <SelectContext.Provider value={contextValue}>
      <ContentClassNamesProvider value={classes}>
        <PopoverRoot show={open} onVisibleChange={handleVisibleChange}>
          {children}
        </PopoverRoot>
      </ContentClassNamesProvider>
    </SelectContext.Provider>
  );
}
SelectRoot.displayName = "SelectRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectTriggerProps
  extends Omit<LynxStyledElementProps, "bindtap">,
    LynxAccessibilityProps {
  bindtap?: LynxPressableProps["bindtap"];
  bindlayoutchange?: LynxViewProps["bindlayoutchange"];
}

export const SelectTrigger = React.forwardRef<unknown, SelectTriggerProps>((props, ref) => {
  const {
    children,
    className,
    bindtap,
    bindlayoutchange,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription = "button",
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    ...nativeProps
  } = props;
  const context = useSelectContext("SelectTrigger");
  const handleLayoutChange = React.useCallback<LayoutChangeHandler>(
    (...args) => {
      bindlayoutchange?.(...args);
      const width = getLayoutWidth(args[0]);
      if (width !== null) context.setTriggerWidth(width);
    },
    [bindlayoutchange, context],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    disabled: context.disabled || context.readOnly,
    onTap: bindtap,
  });
  const classes = selectTrigger({
    size: context.size,
    open: context.open,
    pressed,
    disabled: context.disabled,
    invalid: context.invalid,
    readOnly: context.readOnly,
  });
  const resolvedText = getValueText(context);
  const accessibilityText = typeof resolvedText === "string" ? resolvedText : undefined;

  return (
    <TriggerClassNamesProvider value={classes}>
      <PopoverTrigger disabled={context.disabled || context.readOnly}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          className={clsx(classes.root, className)}
          accessibility-element={accessibilityElement}
          accessibility-label={accessibilityLabel ?? accessibilityText}
          accessibility-role-description={accessibilityRoleDescription}
          accessibility-traits={accessibilityTraits ?? (context.disabled ? "disabled" : "button")}
          accessibility-value={accessibilityValue ?? accessibilityText}
          bindlayoutchange={handleLayoutChange}
          {...pressHandlers}
          {...nativeProps}
        >
          {children}
        </view>
      </PopoverTrigger>
    </TriggerClassNamesProvider>
  );
});
SelectTrigger.displayName = "SelectTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectValueProps extends Omit<LynxStyledElementProps, "children"> {}

export const SelectValue = React.forwardRef<unknown, SelectValueProps>((props, ref) => {
  const { className, ...nativeProps } = props;
  const context = useSelectContext("SelectValue");
  const value = getValueText(context);
  if (value === null || value === "") return null;
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(useTriggerClassNames().value, className)}
      {...nativeProps}
    >
      {value}
    </text>
  );
});
SelectValue.displayName = "SelectValue";

export interface SelectPlaceholderProps extends LynxStyledElementProps {}

export const SelectPlaceholder = React.forwardRef<unknown, SelectPlaceholderProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSelectContext("SelectPlaceholder");
  if (getResolvedOptions(context).length > 0) return null;
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(useTriggerClassNames().placeholder, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
SelectPlaceholder.displayName = "SelectPlaceholder";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectPrefixIconProps extends LynxStyledElementProps {}

export const SelectPrefixIcon = React.forwardRef<unknown, SelectPrefixIconProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSelectContext("SelectPrefixIcon");
  const option = context.values.length === 1 ? context.options.get(context.values[0]) : undefined;
  const icon = option?.prefixIcon ?? children;
  if (!icon) return null;
  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(useTriggerClassNames().prefixIcon, className)}
      accessibility-elements-hidden={true}
      {...nativeProps}
    >
      {icon}
    </view>
  );
});
SelectPrefixIcon.displayName = "SelectPrefixIcon";

export interface SelectSuffixIconProps extends LynxStyledElementProps {}

export const SelectSuffixIcon = React.forwardRef<unknown, SelectSuffixIconProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(useTriggerClassNames().suffixIcon, className)}
      accessibility-elements-hidden={true}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
SelectSuffixIcon.displayName = "SelectSuffixIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectPositionerProps
  extends Omit<
    PopoverPositionerProps,
    "placement" | "placementOffset" | "autoAdjust" | "children"
  > {
  children?: React.ReactNode;
  placement?: PopoverPositionerProps["placement"];
  placementOffset?: number;
  crossAxisOffset?: number;
  autoAdjust?: PopoverPositionerProps["autoAdjust"];
}

export function SelectPositioner(props: SelectPositionerProps) {
  const {
    children,
    className,
    style,
    placement = "bottom-start",
    placementOffset = 8,
    crossAxisOffset,
    autoAdjust = "size",
    ...nativeProps
  } = props;
  const classes = useContentClassNames();
  const { triggerWidth } = useSelectContext("SelectPositioner");
  const positionerStyle = {
    ...(triggerWidth !== null ? { width: `${triggerWidth}px` } : {}),
    ...style,
  };
  return (
    <PopoverPositioner
      placement={placement}
      placementOffset={placementOffset}
      crossAxisOffset={crossAxisOffset}
      autoAdjust={autoAdjust}
      className={className}
      style={positionerStyle}
      {...nativeProps}
    >
      <PopoverBackdrop className={classes.backdrop} />
      {children}
    </PopoverPositioner>
  );
}

export interface SelectContentProps extends PopoverContentProps {}

export function SelectContent(props: SelectContentProps) {
  const { children, className, transition = true, ...nativeProps } = props;
  return (
    <PopoverContent
      className={clsx(useContentClassNames().root, className)}
      transition={transition}
      {...nativeProps}
    >
      {children}
    </PopoverContent>
  );
}
////////////////////////////////////////////////////////////////////////////////////

export interface SelectScrollAreaProps extends LynxStyledElementProps {}

export const SelectScrollArea = React.forwardRef<unknown, SelectScrollAreaProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  return (
    <scroll-view
      scroll-y={true}
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(useContentClassNames().scrollArea, className)}
      {...nativeProps}
    >
      {children}
    </scroll-view>
  );
});
SelectScrollArea.displayName = "SelectScrollArea";

export interface SelectGroupProps extends LynxStyledElementProps {}

export const SelectGroup = React.forwardRef<unknown, SelectGroupProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(useContentClassNames().group, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
SelectGroup.displayName = "SelectGroup";

export interface SelectGroupLabelProps extends LynxStyledElementProps {}

export const SelectGroupLabel = React.forwardRef<unknown, SelectGroupLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(useContentClassNames().groupLabel, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
SelectGroupLabel.displayName = "SelectGroupLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemProps extends PublicSelectItemVariantProps, LynxStyledElementProps {
  value: string;
}

export const SelectItem = React.forwardRef<unknown, SelectItemProps>((props, ref) => {
  const { children, className, value, ...nativeProps } = props;
  const context = useSelectContext("SelectItem");
  const option = context.options.get(value);
  if (!option) {
    throw new Error(
      `<SelectItem value="${value}"/> requires a matching option in <SelectRoot options/>.`,
    );
  }
  const disabled = context.disabled || option.disabled === true;
  const selected = context.values.includes(value);
  const { pressed, ...pressHandlers } = usePressTap({
    disabled: disabled || context.readOnly,
    onTap: () => context.selectItem(value),
  });
  const classes = selectItem({ size: context.size, selected, pressed, disabled });
  const itemContextValue = React.useMemo<SelectItemContextValue>(
    () => ({ ...option, selected, disabled, pressed }),
    [disabled, option, pressed, selected],
  );
  return (
    <SelectItemContext.Provider value={itemContextValue}>
      <ItemClassNamesProvider value={classes}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          className={clsx(classes.root, className)}
          accessibility-element={true}
          accessibility-label={option.textValue}
          accessibility-role-description="option"
          accessibility-traits={disabled ? "disabled" : selected ? "selected" : "button"}
          accessibility-value={selected ? "selected" : "not selected"}
          {...pressHandlers}
          {...nativeProps}
        >
          {children}
        </view>
      </ItemClassNamesProvider>
    </SelectItemContext.Provider>
  );
});
SelectItem.displayName = "SelectItem";

export interface SelectItemPrefixIconProps extends LynxStyledElementProps {}

export const SelectItemPrefixIcon = React.forwardRef<unknown, SelectItemPrefixIconProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useSelectItemContext("SelectItemPrefixIcon");
    const icon = children ?? context.prefixIcon;
    if (!icon) return null;
    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(useItemClassNames().prefixIcon, className)}
        accessibility-elements-hidden={true}
        {...nativeProps}
      >
        {icon}
      </view>
    );
  },
);
SelectItemPrefixIcon.displayName = "SelectItemPrefixIcon";

export interface SelectItemBodyProps extends LynxStyledElementProps {}

export const SelectItemBody = React.forwardRef<unknown, SelectItemBodyProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(useItemClassNames().body, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
SelectItemBody.displayName = "SelectItemBody";

export interface SelectItemLabelProps extends LynxStyledElementProps {}

export const SelectItemLabel = React.forwardRef<unknown, SelectItemLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSelectItemContext("SelectItemLabel");
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(useItemClassNames().label, className)}
      {...nativeProps}
    >
      {children ?? context.label ?? context.textValue}
    </text>
  );
});
SelectItemLabel.displayName = "SelectItemLabel";

export interface SelectItemDescriptionProps extends LynxStyledElementProps {}

export const SelectItemDescription = React.forwardRef<unknown, SelectItemDescriptionProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(useItemClassNames().description, className)}
        {...nativeProps}
      >
        {children}
      </text>
    );
  },
);
SelectItemDescription.displayName = "SelectItemDescription";

export interface SelectItemIndicatorProps extends LynxStyledElementProps {}

export const SelectItemIndicator = React.forwardRef<unknown, SelectItemIndicatorProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const item = useSelectItemContext("SelectItemIndicator");
    if (!item.selected || children == null) return null;
    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(useItemClassNames().indicator, className)}
        accessibility-elements-hidden={true}
        {...nativeProps}
      >
        {children}
      </view>
    );
  },
);

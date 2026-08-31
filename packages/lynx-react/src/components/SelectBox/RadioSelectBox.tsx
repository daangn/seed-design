import * as React from "@lynx-js/react";
import clsx from "clsx";

import { selectBox, type SelectBoxVariantProps } from "@seed-design/lynx-css/recipes/select-box";
import {
  selectBoxGroup,
  type SelectBoxGroupVariantProps,
} from "@seed-design/lynx-css/recipes/select-box-group";
import { radiomark, type RadiomarkVariantProps } from "@seed-design/lynx-css/recipes/radiomark";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";

interface GroupContextValue {
  value: string | null;
  setValue: (value: string) => void;
  disabled: boolean;
  layout: NonNullable<SelectBoxVariantProps["layout"]>;
}

const GroupContext = React.createContext<GroupContextValue | null>(null);

function useGroupContext(consumer: string): GroupContextValue {
  const context = React.useContext(GroupContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <RadioSelectBoxGroup/>.`);
  return context;
}

interface ItemContextValue {
  checked: boolean;
  disabled: boolean;
  pressed: boolean;
  classNames: ReturnType<typeof selectBox>;
  footerVisibility: "when-selected" | "when-not-selected" | "always";
}

const ItemContext = React.createContext<ItemContextValue | null>(null);

function useItemContext(consumer: string): ItemContextValue {
  const context = React.useContext(ItemContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <RadioSelectBoxItem/>.`);
  return context;
}

export interface RadioSelectBoxGroupProps
  extends SelectBoxGroupVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  /** @default "1" */
  columns?: "1" | "2";
}

export const RadioSelectBoxGroup = React.forwardRef<unknown, RadioSelectBoxGroupProps>(
  (props, ref) => {
    const [variantProps, restProps] = selectBoxGroup.splitVariantProps(props);
    const {
      children,
      className,
      value: valueProp,
      defaultValue,
      disabled = false,
      onValueChange,
      ...nativeProps
    } = restProps;
    const [value, setValueInternal] = useControllableState<string | null>({
      value: valueProp,
      defaultValue: defaultValue ?? null,
      onChange: (nextValue) => {
        if (nextValue !== null) onValueChange?.(nextValue);
      },
    });
    const setValue = React.useCallback(
      (nextValue: string) => setValueInternal(nextValue),
      [setValueInternal],
    );
    const columns = variantProps.columns ?? "1";
    const layout = columns === "1" ? "horizontal" : "vertical";
    const contextValue = React.useMemo<GroupContextValue>(
      () => ({ value, setValue, disabled, layout }),
      [value, setValue, disabled, layout],
    );

    return (
      <GroupContext.Provider value={contextValue}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          className={clsx(selectBoxGroup({ ...variantProps, columns }), className)}
          {...nativeProps}
        >
          {children}
        </view>
      </GroupContext.Provider>
    );
  },
);
RadioSelectBoxGroup.displayName = "RadioSelectBoxGroup";

export interface RadioSelectBoxItemProps
  extends SelectBoxVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {
  value: string;
  disabled?: boolean;
  /** @default "when-selected" */
  footerVisibility?: "when-selected" | "when-not-selected" | "always";
}

export const RadioSelectBoxItem = React.forwardRef<unknown, RadioSelectBoxItemProps>(
  (props, ref) => {
    const [variantProps, restProps] = selectBox.splitVariantProps(props);
    const {
      children,
      className,
      value,
      footerVisibility = "when-selected",
      ...nativeProps
    } = restProps;
    const group = useGroupContext("RadioSelectBoxItem");
    const checked = group.value === value;
    const disabled = group.disabled || (variantProps.disabled ?? false);
    const { pressed, ...pressHandlers } = usePressTap({
      disabled,
      onTap: () => {
        if (!checked) group.setValue(value);
      },
    });
    const classNames = selectBox({
      layout: group.layout,
      ...variantProps,
      selected: checked,
      pressed,
      disabled,
    });
    const contextValue = React.useMemo<ItemContextValue>(
      () => ({ checked, disabled, pressed, classNames, footerVisibility }),
      [checked, disabled, pressed, classNames, footerVisibility],
    );

    return (
      <ItemContext.Provider value={contextValue}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          className={clsx(classNames.root, className)}
          accessibility-element={true}
          accessibility-role-description="radio"
          accessibility-value={checked ? "selected" : "not selected"}
          accessibility-traits={disabled ? "disabled" : "button"}
          {...nativeProps}
          {...pressHandlers}
        >
          {children}
        </view>
      </ItemContext.Provider>
    );
  },
);
RadioSelectBoxItem.displayName = "RadioSelectBoxItem";

function createViewSlot(slot: "trigger" | "content" | "body" | "footer", displayName: string) {
  const Component = React.forwardRef<unknown, LynxStyledElementProps>((props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useItemContext(displayName);
    if (
      slot === "footer" &&
      context.footerVisibility !== "always" &&
      (context.footerVisibility === "when-selected") !== context.checked
    ) {
      return null;
    }

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(context.classNames[slot], className)}
        {...nativeProps}
      >
        {children}
      </view>
    );
  });
  Component.displayName = displayName;
  return Component;
}

function createTextSlot(slot: "label" | "description", displayName: string) {
  const Component = React.forwardRef<unknown, LynxStyledElementProps>((props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useItemContext(displayName);
    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(context.classNames[slot], className)}
        {...nativeProps}
      >
        {children}
      </text>
    );
  });
  Component.displayName = displayName;
  return Component;
}

export interface RadioSelectBoxRadiomarkProps
  extends Pick<RadiomarkVariantProps, "tone" | "size">,
    LynxStyledElementProps {}

export const RadioSelectBoxRadiomark = React.forwardRef<unknown, RadioSelectBoxRadiomarkProps>(
  (props, ref) => {
    const [variantProps, restProps] = radiomark.splitVariantProps(props);
    const { className, ...nativeProps } = restProps;
    const context = useItemContext("RadioSelectBoxRadiomark");
    const classes = radiomark({
      tone: "neutral",
      size: "medium",
      ...variantProps,
      checked: context.checked,
      pressed: context.pressed,
      disabled: context.disabled,
    });

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(classes.root, className)}
        {...nativeProps}
      >
        <view className={classes.icon} />
      </view>
    );
  },
);
RadioSelectBoxRadiomark.displayName = "RadioSelectBoxRadiomark";

export const RadioSelectBoxTrigger = createViewSlot("trigger", "RadioSelectBoxTrigger");
export const RadioSelectBoxContent = createViewSlot("content", "RadioSelectBoxContent");
export const RadioSelectBoxBody = createViewSlot("body", "RadioSelectBoxBody");
export const RadioSelectBoxLabel = createTextSlot("label", "RadioSelectBoxLabel");
export const RadioSelectBoxDescription = createTextSlot("description", "RadioSelectBoxDescription");
export const RadioSelectBoxFooter = createViewSlot("footer", "RadioSelectBoxFooter");

export type RadioSelectBoxTriggerProps = LynxStyledElementProps;
export type RadioSelectBoxContentProps = LynxStyledElementProps;
export type RadioSelectBoxBodyProps = LynxStyledElementProps;
export type RadioSelectBoxLabelProps = LynxStyledElementProps;
export type RadioSelectBoxDescriptionProps = LynxStyledElementProps;
export type RadioSelectBoxFooterProps = LynxStyledElementProps;

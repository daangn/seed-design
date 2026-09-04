import * as React from "@lynx-js/react";
import clsx from "clsx";

import { chip, type ChipVariantProps } from "@seed-design/lynx-css/recipes/chip";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import {
  IconRequired,
  IconSlotProvider,
  PrefixIcon,
  SuffixIcon,
  type PrefixIconProps,
  type SuffixIconProps,
} from "../Icon/Icon";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(chip);

type ChipPublicVariantProps = Omit<ChipVariantProps, "selected" | "pressed">;

interface ChipRootViewProps
  extends ChipVariantProps,
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

const ChipRootView = React.forwardRef<unknown, ChipRootViewProps>((props, ref) => {
  const [variantProps, otherProps] = chip.splitVariantProps(props);
  const classes = chip(variantProps);
  const { children, className, ...nativeProps } = otherProps;
  const iconSlotContextValue = React.useMemo(
    () => ({
      classNames: {
        icon: classes.icon,
        prefixIcon: classes.prefixIcon,
        suffixIcon: classes.suffixIcon,
      },
      deps: [
        variantProps.variant,
        variantProps.size,
        variantProps.layout,
        variantProps.selected,
        variantProps.pressed,
        variantProps.disabled,
      ],
    }),
    [
      classes.icon,
      classes.prefixIcon,
      classes.suffixIcon,
      variantProps.variant,
      variantProps.size,
      variantProps.layout,
      variantProps.selected,
      variantProps.pressed,
      variantProps.disabled,
    ],
  );

  return (
    <ClassNamesProvider value={classes}>
      <IconSlotProvider value={iconSlotContextValue}>
        <IconRequired enabled={variantProps.layout === "iconOnly"}>
          <view
            {...(ref ? { ref: ref as LynxViewRef } : {})}
            className={clsx(classes.root, className)}
            {...nativeProps}
          >
            {children}
          </view>
        </IconRequired>
      </IconSlotProvider>
    </ClassNamesProvider>
  );
});
ChipRootView.displayName = "ChipRootView";

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HTML button 속성 및 native form 제출
 * - 키보드 focus / focusVisible
 * - `asChild`
 */
export interface ChipButtonProps
  extends ChipPublicVariantProps,
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  disabled?: boolean;
}

export const ChipButton = React.forwardRef<unknown, ChipButtonProps>((props, ref) => {
  const {
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    disabled = false,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "button",
    "accessibility-traits": accessibilityTraits,
    ...restProps
  } = props;
  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: bindtap,
    mainThreadOnTap: mainThreadBindtap,
  });

  return (
    <ChipRootView
      ref={ref}
      {...restProps}
      disabled={disabled}
      selected={false}
      pressed={pressed}
      accessibility-element={accessibilityElement}
      accessibility-role-description={accessibilityRoleDescription}
      accessibility-traits={accessibilityTraits ?? (disabled ? "disabled" : undefined)}
      {...pressHandlers}
    />
  );
});
ChipButton.displayName = "ChipButton";

/** React `Chip.Root`에 대응하는 기본 action chip입니다. */
export interface ChipRootProps extends ChipButtonProps {}

export const ChipRoot = React.forwardRef<unknown, ChipRootProps>((props, ref) => (
  <ChipButton ref={ref} {...props} />
));
ChipRoot.displayName = "ChipRoot";

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / inputProps / name / value: Lynx에 HTML form 제출 모델이 없음
 * - raw DOM `onChange`: `onCheckedChange`로 대체
 */
export interface ChipToggleProps extends ChipButtonProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const ChipToggle = React.forwardRef<unknown, ChipToggleProps>((props, ref) => {
  const {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    disabled = false,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "toggle",
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    ...restProps
  } = props;
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const handleTap = React.useCallback(
    (...args: Parameters<NonNullable<LynxPressableProps["bindtap"]>>) => {
      setChecked(!checked);
      bindtap?.(...args);
    },
    [bindtap, checked, setChecked],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: handleTap,
    mainThreadOnTap: mainThreadBindtap,
  });

  return (
    <ChipRootView
      ref={ref}
      {...restProps}
      disabled={disabled}
      selected={checked}
      pressed={pressed}
      accessibility-element={accessibilityElement}
      accessibility-role-description={accessibilityRoleDescription}
      accessibility-traits={accessibilityTraits ?? (disabled ? "disabled" : undefined)}
      accessibility-value={accessibilityValue ?? (checked ? "checked" : "not checked")}
      {...pressHandlers}
    />
  );
});
ChipToggle.displayName = "ChipToggle";

////////////////////////////////////////////////////////////////////////////////////

interface ChipRadioGroupContextValue {
  value: string | null;
  setValue: (value: string) => void;
  disabled: boolean;
}

const ChipRadioGroupContext = React.createContext<ChipRadioGroupContextValue | null>(null);

function useChipRadioGroupContext(consumer: string): ChipRadioGroupContextValue {
  const context = React.useContext(ChipRadioGroupContext);
  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside <ChipRadioRoot/>.`);
  }
  return context;
}

export interface ChipRadioRootProps extends LynxStyledElementProps {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

export const ChipRadioRoot = React.forwardRef<unknown, ChipRadioRootProps>((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
    disabled = false,
    onValueChange,
    children,
    className,
    ...nativeProps
  } = props;
  const handleChange = React.useCallback(
    (nextValue: string | null) => {
      if (nextValue !== null) onValueChange?.(nextValue);
    },
    [onValueChange],
  );
  const [value, setValueInternal] = useControllableState<string | null>({
    value: valueProp !== undefined ? valueProp : undefined,
    defaultValue: defaultValue ?? null,
    onChange: handleChange,
  });
  const setValue = React.useCallback(
    (nextValue: string) => setValueInternal(nextValue),
    [setValueInternal],
  );
  const contextValue = React.useMemo(
    () => ({ value, setValue, disabled }),
    [value, setValue, disabled],
  );

  return (
    <ChipRadioGroupContext.Provider value={contextValue}>
      <view {...(ref ? { ref: ref as LynxViewRef } : {})} className={className} {...nativeProps}>
        {children}
      </view>
    </ChipRadioGroupContext.Provider>
  );
});
ChipRadioRoot.displayName = "ChipRadioRoot";

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / inputProps / name / required: Lynx에 HTML form 제출 모델이 없음
 * - raw DOM `onChange`: `Chip.RadioRoot`의 `onValueChange`로 대체
 */
export interface ChipRadioItemProps extends ChipButtonProps {
  value: string;
}

export const ChipRadioItem = React.forwardRef<unknown, ChipRadioItemProps>((props, ref) => {
  const {
    value: itemValue,
    disabled: itemDisabled = false,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "radio",
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    ...restProps
  } = props;
  const group = useChipRadioGroupContext("ChipRadioItem");
  const disabled = group.disabled || itemDisabled;
  const selected = group.value === itemValue;
  const handleTap = React.useCallback(
    (...args: Parameters<NonNullable<LynxPressableProps["bindtap"]>>) => {
      if (!selected) group.setValue(itemValue);
      bindtap?.(...args);
    },
    [bindtap, group, itemValue, selected],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: handleTap,
    mainThreadOnTap: mainThreadBindtap,
  });

  return (
    <ChipRootView
      ref={ref}
      {...restProps}
      disabled={disabled}
      selected={selected}
      pressed={pressed}
      accessibility-element={accessibilityElement}
      accessibility-role-description={accessibilityRoleDescription}
      accessibility-traits={accessibilityTraits ?? (disabled ? "disabled" : undefined)}
      accessibility-value={accessibilityValue ?? (selected ? "selected" : "not selected")}
      {...pressHandlers}
    />
  );
});
ChipRadioItem.displayName = "ChipRadioItem";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipLabelProps extends LynxStyledElementProps {}

export const ChipLabel = React.forwardRef<unknown, ChipLabelProps>((props, ref) => {
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(classes.label, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
ChipLabel.displayName = "ChipLabel";

export interface ChipPrefixIconProps extends PrefixIconProps {}

export const ChipPrefixIcon = React.forwardRef<unknown, ChipPrefixIconProps>((props, ref) => (
  <PrefixIcon ref={ref} {...props} />
));
ChipPrefixIcon.displayName = "ChipPrefixIcon";

export interface ChipPrefixAvatarProps extends LynxStyledElementProps {}

export const ChipPrefixAvatar = React.forwardRef<unknown, ChipPrefixAvatarProps>((props, ref) => {
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.prefixAvatar, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
ChipPrefixAvatar.displayName = "ChipPrefixAvatar";

export interface ChipSuffixIconProps extends SuffixIconProps {}

export const ChipSuffixIcon = React.forwardRef<unknown, ChipSuffixIconProps>((props, ref) => (
  <SuffixIcon ref={ref} {...props} />
));
ChipSuffixIcon.displayName = "ChipSuffixIcon";

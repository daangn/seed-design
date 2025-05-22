"use client";

import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useRadioGroup, type RadioItemProps, type UseRadioGroupProps } from "./useRadioGroup";
import { RadioGroupProvider, useRadioGroupContext } from "./useRadioGroupContext";
import { RadioGroupItemProvider, useRadioGroupItemContext } from "./useRadioGroupItemContext";

export interface RadioGroupRootProps
  extends UseRadioGroupProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {}

export const RadioGroupRoot = forwardRef<HTMLDivElement, RadioGroupRootProps>((props, ref) => {
  const { value, defaultValue, onValueChange, form, name, disabled, ...otherProps } = props;

  const api = useRadioGroup({
    value,
    defaultValue,
    onValueChange,
    disabled,
    form,
    name,
  });
  const mergedProps = mergeProps(api.rootProps, otherProps);

  return (
    <RadioGroupProvider value={api}>
      <Primitive.div ref={ref} {...mergedProps} />
    </RadioGroupProvider>
  );
});
RadioGroupRoot.displayName = "RadioGroupRoot";

export interface RadioGroupLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioGroupLabel = forwardRef<HTMLLabelElement, RadioGroupLabelProps>((props, ref) => {
  const { labelProps } = useRadioGroupContext();
  const mergedProps = mergeProps(labelProps, props);
  return <Primitive.label ref={ref} {...mergedProps} />;
});
RadioGroupLabel.displayName = "RadioGroupLabel";

export interface RadioGroupItemProps
  extends RadioItemProps,
    PrimitiveProps,
    Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "value"> {}

export const RadioGroupItem = forwardRef<HTMLLabelElement, RadioGroupItemProps>((props, ref) => {
  const { value, invalid, disabled, ...otherProps } = props;
  const { getItemProps } = useRadioGroupContext();
  const itemProps = getItemProps({ value, disabled, invalid });
  const mergedProps = mergeProps(itemProps.rootProps, otherProps);
  return (
    <RadioGroupItemProvider value={itemProps}>
      <Primitive.label ref={ref} {...mergedProps} />
    </RadioGroupItemProvider>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export interface RadioGroupItemControlProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioGroupItemControl = forwardRef<HTMLDivElement, RadioGroupItemControlProps>(
  (props, ref) => {
    const { controlProps } = useRadioGroupItemContext();
    const mergedProps = mergeProps(controlProps, props);
    return <Primitive.div ref={ref} {...mergedProps} />;
  },
);
RadioGroupItemControl.displayName = "RadioGroupItemControl";

export interface RadioGroupItemHiddenInputProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLInputElement> {}

export const RadioGroupItemHiddenInput = forwardRef<
  HTMLInputElement,
  RadioGroupItemHiddenInputProps
>((props, ref) => {
  const { hiddenInputProps } = useRadioGroupItemContext();
  const mergedProps = mergeProps(hiddenInputProps, props);
  return <Primitive.input ref={ref} {...mergedProps} />;
});
RadioGroupItemHiddenInput.displayName = "RadioGroupItemHiddenInput";

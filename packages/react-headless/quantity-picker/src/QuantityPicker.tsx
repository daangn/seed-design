"use client";

import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import * as React from "react";
import { useQuantityPicker, type UseQuantityPickerProps } from "./useQuantityPicker";
import { QuantityPickerProvider, useQuantityPickerContext } from "./useQuantityPickerContext";

export interface QuantityPickerRootProps
  extends UseQuantityPickerProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "dir"> {}

export const QuantityPickerRoot = React.forwardRef<HTMLDivElement, QuantityPickerRootProps>(
  ({ children, ...props }, ref) => {
    const {
      defaultValue,
      dir,
      disabled,
      getValueText,
      invalid,
      loading,
      max,
      min,
      onRemove,
      onValueChange,
      readOnly,
      removable,
      removeAriaLabel,
      step,
      value,
      ...otherProps
    } = props;
    const api = useQuantityPicker({
      defaultValue,
      dir,
      disabled,
      getValueText,
      invalid,
      loading,
      max,
      min,
      onRemove,
      onValueChange,
      readOnly,
      removable,
      removeAriaLabel,
      step,
      value,
    });
    const childrenArray = React.Children.toArray(children);
    const hiddenInputs = childrenArray.filter(
      (child) => React.isValidElement(child) && child.type === QuantityPickerHiddenInput,
    );
    const visibleChildren = childrenArray.filter(
      (child) => !(React.isValidElement(child) && child.type === QuantityPickerHiddenInput),
    );
    const orderedChildren =
      api.dir === "rtl" ? [...visibleChildren.reverse(), ...hiddenInputs] : children;

    return (
      <QuantityPickerProvider value={api}>
        <Primitive.div ref={ref} {...mergeProps(api.rootProps, otherProps)}>
          {orderedChildren}
        </Primitive.div>
      </QuantityPickerProvider>
    );
  },
);
QuantityPickerRoot.displayName = "QuantityPickerRoot";

export interface QuantityPickerDecrementButtonProps
  extends PrimitiveProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "type"> {}

export const QuantityPickerDecrementButton = React.forwardRef<
  HTMLButtonElement,
  QuantityPickerDecrementButtonProps
>((props, ref) => {
  const { decrementButtonProps, isRemoveButton } = useQuantityPickerContext();
  const mergedProps = mergeProps(decrementButtonProps, props);

  return (
    <Primitive.button
      ref={ref}
      {...mergedProps}
      aria-label={isRemoveButton ? decrementButtonProps["aria-label"] : mergedProps["aria-label"]}
    />
  );
});
QuantityPickerDecrementButton.displayName = "QuantityPickerDecrementButton";

export interface QuantityPickerValueDisplayProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {}

export const QuantityPickerValueDisplay = React.forwardRef<
  HTMLSpanElement,
  QuantityPickerValueDisplayProps
>((props, ref) => {
  const { valueDisplayProps } = useQuantityPickerContext();

  return <Primitive.span ref={ref} {...mergeProps(valueDisplayProps, props)} />;
});
QuantityPickerValueDisplay.displayName = "QuantityPickerValueDisplay";

export interface QuantityPickerIncrementButtonProps
  extends PrimitiveProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "type"> {}

export const QuantityPickerIncrementButton = React.forwardRef<
  HTMLButtonElement,
  QuantityPickerIncrementButtonProps
>((props, ref) => {
  const { incrementButtonProps } = useQuantityPickerContext();

  return <Primitive.button ref={ref} {...mergeProps(incrementButtonProps, props)} />;
});
QuantityPickerIncrementButton.displayName = "QuantityPickerIncrementButton";

export interface QuantityPickerHiddenInputProps
  extends PrimitiveProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "disabled" | "required" | "type" | "value"> {}

export const QuantityPickerHiddenInput = React.forwardRef<
  HTMLInputElement,
  QuantityPickerHiddenInputProps
>((props, ref) => {
  const { hiddenInputProps } = useQuantityPickerContext();

  return <Primitive.input ref={ref} {...mergeProps(hiddenInputProps, props)} />;
});
QuantityPickerHiddenInput.displayName = "QuantityPickerHiddenInput";

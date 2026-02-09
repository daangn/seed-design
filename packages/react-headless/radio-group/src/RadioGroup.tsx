"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
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
  const { value, defaultValue, onValueChange, form, name, disabled, invalid, ...otherProps } =
    props;

  const api = useRadioGroup({
    value,
    defaultValue,
    onValueChange,
    form,
    name,
    disabled,
    invalid,
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

export const RadioGroupLabel = forwardRef<HTMLDivElement, RadioGroupLabelProps>((props, ref) => {
  const { refs, labelProps } = useRadioGroupContext();
  const mergedProps = mergeProps(labelProps, props);

  return <Primitive.div ref={composeRefs(refs.label, ref)} {...mergedProps} />;
});
RadioGroupLabel.displayName = "RadioGroupLabel";

export interface RadioGroupItemProps
  extends RadioItemProps,
    PrimitiveProps,
    Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "value"> {}

export const RadioGroupItem = forwardRef<HTMLLabelElement, RadioGroupItemProps>((props, ref) => {
  const { value, disabled, ...otherProps } = props;
  const { getItemProps } = useRadioGroupContext();
  const itemProps = getItemProps({ value, disabled });
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

export interface RadioGroupDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const RadioGroupDescription = forwardRef<HTMLSpanElement, RadioGroupDescriptionProps>(
  (props, ref) => {
    const { refs, descriptionProps } = useRadioGroupContext();
    const mergedProps = mergeProps(descriptionProps, props);

    return <Primitive.span ref={composeRefs(refs.description, ref)} {...mergedProps} />;
  },
);
RadioGroupDescription.displayName = "RadioGroupDescription";

export interface RadioGroupErrorMessageProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioGroupErrorMessage = forwardRef<HTMLDivElement, RadioGroupErrorMessageProps>(
  (props, ref) => {
    const { refs, errorMessageProps } = useRadioGroupContext();
    const mergedProps = mergeProps(errorMessageProps, props);

    return <Primitive.div ref={composeRefs(refs.errorMessage, ref)} {...mergedProps} />;
  },
);
RadioGroupErrorMessage.displayName = "RadioGroupErrorMessage";

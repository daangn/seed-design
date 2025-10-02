"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useNumberField, type UseNumberFieldProps } from "./useNumberField";
import { NumberFieldProvider, useNumberFieldContext } from "./useNumberFieldContext";

export interface NumberFieldRootProps
  extends UseNumberFieldProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "defaultValue" | "onChange"> {}

export const NumberFieldRoot = forwardRef<HTMLDivElement, NumberFieldRootProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onValueChange,
    readOnly,
    disabled,
    invalid,
    required,
    min,
    max,
    step,
    formatOptions,
    locale,
    name,
    ...otherProps
  } = props;

  const api = useNumberField({
    value,
    defaultValue,
    onValueChange,
    disabled,
    invalid,
    required,
    readOnly,
    min,
    max,
    step,
    formatOptions,
    locale,
    name,
  });
  const mergedProps = mergeProps(api.rootProps, otherProps);

  return (
    <NumberFieldProvider value={api}>
      <Primitive.div ref={ref} {...mergedProps} />
    </NumberFieldProvider>
  );
});
NumberFieldRoot.displayName = "NumberFieldRoot";

export interface NumberFieldLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLLabelElement> {}

export const NumberFieldLabel = forwardRef<HTMLLabelElement, NumberFieldLabelProps>(
  (props, ref) => {
    const { refs, labelProps } = useNumberFieldContext();
    const mergedProps = mergeProps(labelProps, props);
    return <Primitive.label ref={composeRefs(refs.label, ref)} {...mergedProps} />;
  },
);
NumberFieldLabel.displayName = "NumberFieldLabel";

export interface NumberFieldDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const NumberFieldDescription = forwardRef<HTMLSpanElement, NumberFieldDescriptionProps>(
  (props, ref) => {
    const { refs, descriptionProps } = useNumberFieldContext();
    const mergedProps = mergeProps(descriptionProps, props);
    return <Primitive.span ref={composeRefs(refs.description, ref)} {...mergedProps} />;
  },
);

NumberFieldDescription.displayName = "NumberFieldDescription";

export interface NumberFieldErrorMessageProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const NumberFieldErrorMessage = forwardRef<HTMLSpanElement, NumberFieldErrorMessageProps>(
  (props, ref) => {
    const { refs, errorMessageProps } = useNumberFieldContext();
    const mergedProps = mergeProps(errorMessageProps, props);
    return <Primitive.span ref={composeRefs(refs.errorMessage, ref)} {...mergedProps} />;
  },
);
NumberFieldErrorMessage.displayName = "NumberFieldErrorMessage";

export interface NumberFieldInputProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLInputElement> {}

export const NumberFieldInput = forwardRef<HTMLInputElement, NumberFieldInputProps>(
  (props, ref) => {
    const { inputProps } = useNumberFieldContext();
    const mergedProps = mergeProps(inputProps, props);
    return <Primitive.input ref={ref} {...mergedProps} />;
  },
);
NumberFieldInput.displayName = "NumberFieldInput";

export interface NumberFieldIncrementButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NumberFieldIncrementButton = forwardRef<
  HTMLButtonElement,
  NumberFieldIncrementButtonProps
>((props, ref) => {
  const { incrementButtonProps } = useNumberFieldContext();
  const mergedProps = mergeProps(incrementButtonProps, props);
  return <Primitive.button ref={ref} {...mergedProps} />;
});
NumberFieldIncrementButton.displayName = "NumberFieldIncrementButton";

export interface NumberFieldDecrementButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NumberFieldDecrementButton = forwardRef<
  HTMLButtonElement,
  NumberFieldDecrementButtonProps
>((props, ref) => {
  const { decrementButtonProps } = useNumberFieldContext();
  const mergedProps = mergeProps(decrementButtonProps, props);
  return <Primitive.button ref={ref} {...mergedProps} />;
});
NumberFieldDecrementButton.displayName = "NumberFieldDecrementButton";


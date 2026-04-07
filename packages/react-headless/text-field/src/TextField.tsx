"use client";

import { mergeProps } from "@ride-developer/dom-utils";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useTextField, type UseTextFieldProps } from "./useTextField";
import { TextFieldProvider, useTextFieldContext } from "./useTextFieldContext";

export interface TextFieldRootProps
  extends UseTextFieldProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {}

export const TextFieldRoot = forwardRef<HTMLDivElement, TextFieldRootProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onValueChange,
    readOnly,
    disabled,
    invalid,
    required,
    name,
    ...otherProps
  } = props;

  const api = useTextField({
    value,
    defaultValue,
    onValueChange,
    disabled,
    invalid,
    required,
    readOnly,
    name,
  });

  const mergedProps = mergeProps(api.rootProps, otherProps);

  return (
    <TextFieldProvider value={api}>
      <Primitive.div ref={ref} {...mergedProps} />
    </TextFieldProvider>
  );
});
TextFieldRoot.displayName = "TextFieldRoot";

export interface TextFieldInputProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLInputElement> {}

export const TextFieldInput = forwardRef<HTMLInputElement, TextFieldInputProps>((props, ref) => {
  const { inputProps } = useTextFieldContext();
  const mergedProps = mergeProps(inputProps, props);

  return <Primitive.input ref={ref} {...mergedProps} />;
});
TextFieldInput.displayName = "TextFieldInput";

export interface TextFieldTextareaProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLTextAreaElement> {}

export const TextFieldTextarea = forwardRef<HTMLTextAreaElement, TextFieldTextareaProps>(
  (props, ref) => {
    const { inputProps } = useTextFieldContext();
    const mergedProps = mergeProps(inputProps, props);

    return <Primitive.textarea ref={ref} {...mergedProps} />;
  },
);
TextFieldTextarea.displayName = "TextFieldTextarea";

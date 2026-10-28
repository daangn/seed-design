"use client";

import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
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
  const { inputProps, inputRef } = useTextFieldContext();
  const composedRef = useComposedRefs(ref, inputRef);
  const mergedProps = mergeProps(inputProps, props);

  return <Primitive.input ref={composedRef} {...mergedProps} />;
});
TextFieldInput.displayName = "TextFieldInput";

export interface TextFieldTextareaProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLTextAreaElement> {}

export const TextFieldTextarea = forwardRef<HTMLTextAreaElement, TextFieldTextareaProps>(
  (props, ref) => {
    const { inputProps, inputRef } = useTextFieldContext();
    const composedRef = useComposedRefs(ref, inputRef);
    const mergedProps = mergeProps(inputProps, props);

    return <Primitive.textarea ref={composedRef} {...mergedProps} />;
  },
);
TextFieldTextarea.displayName = "TextFieldTextarea";

export interface TextFieldClearButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Clears the value through a native `input` event, so it works with uncontrolled fields too.
 * Renders nothing while the value is empty.
 */
export const TextFieldClearButton = forwardRef<HTMLButtonElement, TextFieldClearButtonProps>(
  (props, ref) => {
    const { value, clearButtonProps } = useTextFieldContext();
    const mergedProps = mergeProps(clearButtonProps, props);

    if (value === "") return null;

    return <Primitive.button ref={ref} {...mergedProps} />;
  },
);
TextFieldClearButton.displayName = "TextFieldClearButton";

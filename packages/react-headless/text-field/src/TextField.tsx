"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useTextField, type UseTextFieldProps } from "./useTextField";
import { TextFieldProvider, useTextFieldContext } from "./useTextFieldContext";

export interface TextFieldRootProps
  extends UseTextFieldProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "defaultValue"> {}

export const TextFieldRoot = forwardRef<HTMLDivElement, TextFieldRootProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onValueChange,
    readOnly,
    disabled,
    invalid,
    required,
    maxGraphemeCount,
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
    maxGraphemeCount,
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

export interface TextFieldLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLLabelElement> {}

export const TextFieldLabel = forwardRef<HTMLLabelElement, TextFieldLabelProps>((props, ref) => {
  const { refs, labelProps } = useTextFieldContext();
  const mergedProps = mergeProps(labelProps, props);
  return <Primitive.label ref={composeRefs(refs.label, ref)} {...mergedProps} />;
});
TextFieldLabel.displayName = "TextFieldLabel";

export interface TextFieldDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TextFieldDescription = forwardRef<HTMLSpanElement, TextFieldDescriptionProps>(
  (props, ref) => {
    const { refs, descriptionProps } = useTextFieldContext();
    const mergedProps = mergeProps(descriptionProps, props);
    return <Primitive.span ref={composeRefs(refs.description, ref)} {...mergedProps} />;
  },
);

TextFieldDescription.displayName = "TextFieldDescription";

export interface TextFieldErrorMessageProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TextFieldErrorMessage = forwardRef<HTMLSpanElement, TextFieldErrorMessageProps>(
  (props, ref) => {
    const { refs, errorMessageProps } = useTextFieldContext();
    const mergedProps = mergeProps(errorMessageProps, props);
    return <Primitive.span ref={composeRefs(refs.errorMessage, ref)} {...mergedProps} />;
  },
);
TextFieldErrorMessage.displayName = "TextFieldErrorMessage";

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

export interface TextFieldGraphemeCountProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TextFieldGraphemeCount = forwardRef<HTMLSpanElement, TextFieldGraphemeCountProps>(
  (props, ref) => {
    const { stateProps, graphemes } = useTextFieldContext();
    const mergedProps = mergeProps(stateProps, props);
    return (
      <Primitive.span ref={ref} {...mergedProps}>
        {graphemes.length}
      </Primitive.span>
    );
  },
);
TextFieldGraphemeCount.displayName = "TextFieldGraphemeCount";

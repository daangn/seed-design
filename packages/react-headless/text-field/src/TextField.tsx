import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useTextField, type UseTextFieldProps, type UseTextFieldReturn } from "./useTextField";
import { TextFieldProvider, useTextFieldContext } from "./useTextFieldContext";

export interface TextFieldRootProviderProps extends UseTextFieldReturn, PrimitiveProps {}

export const TextFieldRootProvider = forwardRef<HTMLDivElement, TextFieldRootProviderProps>(
  (props, ref) => {
    const { ...otherProps } = props;
    return (
      <TextFieldProvider value={props}>
        <Primitive.div ref={ref} {...otherProps} />
      </TextFieldProvider>
    );
  },
);

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
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

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

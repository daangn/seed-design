import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useFieldContext } from "./useFieldContext";
import { useTextField, type UseTextFieldProps } from "./useTextField";
import { TextFieldProvider, useTextFieldContext } from "./useTextFieldContext";

export interface TextFieldRootProps
  extends UseTextFieldProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "defaultValue"> {}

export const TextFieldRoot = forwardRef<HTMLDivElement, TextFieldRootProps>((props, ref) => {
  const {
    readOnly,
    disabled,
    invalid,
    required,
    value,
    defaultValue,
    onValueChange,
    maxGraphemeCount,
    enforceMaxGraphemeCount,
    ...otherProps
  } = props;

  const api = useTextField({
    disabled,
    invalid,
    required,
    readOnly,
    value,
    defaultValue,
    onValueChange,
    maxGraphemeCount,
    enforceMaxGraphemeCount,
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
  const textFieldCtx = useTextFieldContext({ strict: false });
  const fieldCtx = useFieldContext({ strict: false });
  const mergedProps = mergeProps(textFieldCtx?.inputProps ?? fieldCtx?.inputProps ?? {}, props);
  return <Primitive.input ref={ref} {...mergedProps} />;
});
TextFieldInput.displayName = "TextFieldInput";

export interface TextFieldTextareaProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLTextAreaElement> {}

export const TextFieldTextarea = forwardRef<HTMLTextAreaElement, TextFieldTextareaProps>(
  (props, ref) => {
    const textFieldCtx = useTextFieldContext({ strict: false });
    const fieldCtx = useFieldContext({ strict: false });
    const mergedProps = mergeProps(textFieldCtx?.inputProps ?? fieldCtx?.inputProps ?? {}, props);
    return <Primitive.textarea ref={ref} {...mergedProps} />;
  },
);
TextFieldTextarea.displayName = "TextFieldTextarea";

export interface TextFieldGraphemeCountProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {}

export const TextFieldGraphemeCount = forwardRef<HTMLSpanElement, TextFieldGraphemeCountProps>(
  (props, ref) => {
    const { graphemes } = useTextFieldContext();
    return (
      <Primitive.span ref={ref} {...props}>
        {graphemes.length}
      </Primitive.span>
    );
  },
);

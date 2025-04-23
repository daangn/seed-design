import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useField, type UseFieldProps } from "./useField";
import { FieldProvider, useFieldContext } from "./useFieldContext";

export interface FieldRootProps
  extends UseFieldProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "defaultValue"> {}

export const FieldRoot = forwardRef<HTMLDivElement, FieldRootProps>((props, ref) => {
  const { readOnly, disabled, invalid, required, ...otherProps } = props;

  const api = useField({
    disabled,
    invalid,
    required,
    readOnly,
  });
  const mergedProps = mergeProps(api.rootProps, otherProps);

  return (
    <FieldProvider value={api}>
      <Primitive.div ref={ref} {...mergedProps} />
    </FieldProvider>
  );
});
FieldRoot.displayName = "FieldRoot";

export interface FieldLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLLabelElement> {}

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>((props, ref) => {
  const { refs, labelProps } = useFieldContext();
  const mergedProps = mergeProps(labelProps, props);
  return <Primitive.label ref={composeRefs(refs.label, ref)} {...mergedProps} />;
});
FieldLabel.displayName = "FieldLabel";

export interface FieldDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldDescription = forwardRef<HTMLSpanElement, FieldDescriptionProps>((props, ref) => {
  const { refs, descriptionProps } = useFieldContext();
  const mergedProps = mergeProps(descriptionProps, props);
  return <Primitive.span ref={composeRefs(refs.description, ref)} {...mergedProps} />;
});

FieldDescription.displayName = "FieldDescription";

export interface FieldErrorMessageProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldErrorMessage = forwardRef<HTMLSpanElement, FieldErrorMessageProps>(
  (props, ref) => {
    const { refs, errorMessageProps } = useFieldContext();
    const mergedProps = mergeProps(errorMessageProps, props);
    return <Primitive.span ref={composeRefs(refs.errorMessage, ref)} {...mergedProps} />;
  },
);
FieldErrorMessage.displayName = "FieldErrorMessage";

export interface FieldInputProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLInputElement> {}

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>((props, ref) => {
  const fieldCtx = useFieldContext({ strict: false });
  const mergedProps = mergeProps(fieldCtx?.inputProps ?? {}, props);
  return <Primitive.input ref={ref} {...mergedProps} />;
});
FieldInput.displayName = "FieldInput";

export interface FieldTextareaProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLTextAreaElement> {}

export const FieldTextarea = forwardRef<HTMLTextAreaElement, FieldTextareaProps>((props, ref) => {
  const fieldCtx = useFieldContext({ strict: false });
  const mergedProps = mergeProps(fieldCtx?.inputProps ?? {}, props);
  return <Primitive.textarea ref={ref} {...mergedProps} />;
});
FieldTextarea.displayName = "FieldTextarea";

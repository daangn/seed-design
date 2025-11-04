"use client";

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
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldRoot = forwardRef<HTMLDivElement, FieldRootProps>((props, ref) => {
  const { readOnly, disabled, invalid, required, name, ...otherProps } = props;

  const api = useField({
    disabled,
    invalid,
    required,
    readOnly,
    name,
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
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldErrorMessage = forwardRef<HTMLDivElement, FieldErrorMessageProps>(
  (props, ref) => {
    const { refs, errorMessageProps } = useFieldContext();
    const mergedProps = mergeProps(errorMessageProps, props);
    return <Primitive.div ref={composeRefs(refs.errorMessage, ref)} {...mergedProps} />;
  },
);
FieldErrorMessage.displayName = "FieldErrorMessage";

"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useFormControl, type UseFormControlProps } from "./useFormControl";
import { FormControlProvider, useFormControlContext } from "./useFormControlContext";

export interface FormControlRootProps
  extends UseFormControlProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FormControlRoot = forwardRef<HTMLDivElement, FormControlRootProps>((props, ref) => {
  const { readOnly, disabled, invalid, required, name, ...otherProps } = props;

  const api = useFormControl({
    disabled,
    invalid,
    required,
    readOnly,
    name,
  });
  const mergedProps = mergeProps(api.rootProps, otherProps);

  return (
    <FormControlProvider value={api}>
      <Primitive.div ref={ref} {...mergedProps} />
    </FormControlProvider>
  );
});
FormControlRoot.displayName = "FormControlRoot";

export interface FormControlLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLLabelElement> {}

export const FormControlLabel = forwardRef<HTMLLabelElement, FormControlLabelProps>(
  (props, ref) => {
    const { refs, labelProps } = useFormControlContext();
    const mergedProps = mergeProps(labelProps, props);
    return <Primitive.label ref={composeRefs(refs.label, ref)} {...mergedProps} />;
  },
);
FormControlLabel.displayName = "FormControlLabel";

export interface FormControlDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FormControlDescription = forwardRef<HTMLSpanElement, FormControlDescriptionProps>(
  (props, ref) => {
    const { refs, descriptionProps } = useFormControlContext();
    const mergedProps = mergeProps(descriptionProps, props);

    return <Primitive.span ref={composeRefs(refs.description, ref)} {...mergedProps} />;
  },
);
FormControlDescription.displayName = "FormControlDescription";

export interface FormControlErrorMessageProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FormControlErrorMessage = forwardRef<HTMLDivElement, FormControlErrorMessageProps>(
  (props, ref) => {
    const { refs, errorMessageProps } = useFormControlContext();
    const mergedProps = mergeProps(errorMessageProps, props);
    return <Primitive.div ref={composeRefs(refs.errorMessage, ref)} {...mergedProps} />;
  },
);
FormControlErrorMessage.displayName = "FormControlErrorMessage";

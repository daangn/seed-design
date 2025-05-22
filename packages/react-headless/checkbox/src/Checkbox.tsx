"use client";

import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useCheckbox, type UseCheckboxProps } from "./useCheckbox";
import { CheckboxProvider, useCheckboxContext } from "./useCheckboxContext";
import { composeRefs } from "@radix-ui/react-compose-refs";

export interface CheckboxRootProps
  extends UseCheckboxProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLLabelElement> {}

export const CheckboxRoot = forwardRef<HTMLLabelElement, CheckboxRootProps>((props, ref) => {
  const {
    checked,
    defaultChecked,
    onCheckedChange,
    indeterminate,
    disabled,
    invalid,
    required,
    ...otherProps
  } = props;

  const api = useCheckbox({
    checked,
    defaultChecked,
    onCheckedChange,
    indeterminate,
    disabled,
    invalid,
    required,
  });
  const mergedProps = mergeProps(api.rootProps, otherProps);

  return (
    <CheckboxProvider value={api}>
      <Primitive.label ref={ref} {...mergedProps} />
    </CheckboxProvider>
  );
});
CheckboxRoot.displayName = "CheckboxRoot";

export interface CheckboxControlProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const CheckboxControl = forwardRef<HTMLDivElement, CheckboxControlProps>((props, ref) => {
  const { controlProps } = useCheckboxContext();
  const mergedProps = mergeProps(controlProps, props);
  return <Primitive.div ref={ref} {...mergedProps} />;
});
CheckboxControl.displayName = "CheckboxControl";

export interface CheckboxHiddenInputProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLInputElement> {}

export const CheckboxHiddenInput = forwardRef<HTMLInputElement, CheckboxHiddenInputProps>(
  (props, ref) => {
    const { refs, hiddenInputProps } = useCheckboxContext();
    const mergedProps = mergeProps(hiddenInputProps, props);
    return <Primitive.input ref={composeRefs(refs.input, ref)} {...mergedProps} />;
  },
);
CheckboxHiddenInput.displayName = "CheckboxHiddenInput";

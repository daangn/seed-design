"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import React, { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import { useFieldButton, type UseFieldButtonProps } from "./useFieldButton";
import { FieldButtonProvider, useFieldButtonContext } from "./useFieldButtonContext";

export interface FieldButtonRootProps
  extends UseFieldButtonProps,
    PrimitiveProps,
    HTMLAttributes<HTMLDivElement> {}

export const FieldButtonRoot = forwardRef<HTMLDivElement, FieldButtonRootProps>(
  ({ disabled, readOnly, invalid, name, values, onValuesChange, ...otherProps }, ref) => {
    const api = useFieldButton({ disabled, readOnly, invalid, name, values, onValuesChange });
    const mergedProps = mergeProps(api.rootProps, otherProps);

    return (
      <FieldButtonProvider value={api}>
        <Primitive.div ref={ref} {...mergedProps} />
      </FieldButtonProvider>
    );
  },
);
FieldButtonRoot.displayName = "FieldButtonRoot";

export interface FieldButtonButtonProps
  extends PrimitiveProps,
    ButtonHTMLAttributes<HTMLButtonElement> {}

export const FieldButtonButton = forwardRef<HTMLButtonElement, FieldButtonButtonProps>(
  (props, ref) => {
    const { buttonProps } = useFieldButtonContext();
    const mergedProps = mergeProps(buttonProps, props);

    return <Primitive.button ref={ref} {...mergedProps} />;
  },
);
FieldButtonButton.displayName = "FieldButtonButton";

export interface FieldButtonDescriptionProps
  extends PrimitiveProps,
    HTMLAttributes<HTMLSpanElement> {}

export const FieldButtonDescription = forwardRef<HTMLSpanElement, FieldButtonDescriptionProps>(
  (props, ref) => {
    const { refs, descriptionProps } = useFieldButtonContext();
    const mergedProps = mergeProps(descriptionProps, props);

    return <Primitive.span ref={composeRefs(refs.description, ref)} {...mergedProps} />;
  },
);
FieldButtonDescription.displayName = "FieldButtonDescription";

export interface FieldButtonErrorMessageProps
  extends PrimitiveProps,
    HTMLAttributes<HTMLDivElement> {}

export const FieldButtonErrorMessage = forwardRef<HTMLDivElement, FieldButtonErrorMessageProps>(
  (props, ref) => {
    const { refs, errorMessageProps } = useFieldButtonContext();
    const mergedProps = mergeProps(errorMessageProps, props);

    return <Primitive.div ref={composeRefs(refs.errorMessage, ref)} {...mergedProps} />;
  },
);
FieldButtonErrorMessage.displayName = "FieldButtonErrorMessage";

export interface FieldButtonHiddenInputProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  valueIndex: number;
}

export const FieldButtonHiddenInput = forwardRef<HTMLInputElement, FieldButtonHiddenInputProps>(
  ({ valueIndex, ...props }, ref) => {
    const { getHiddenInputProps } = useFieldButtonContext();
    const hiddenInputProps = getHiddenInputProps(valueIndex);

    if (!hiddenInputProps) return null;

    return <Primitive.input ref={ref} {...mergeProps(hiddenInputProps, props)} />;
  },
);
FieldButtonHiddenInput.displayName = "FieldButtonHiddenInput";

export interface FieldButtonClearButtonProps
  extends PrimitiveProps,
    ButtonHTMLAttributes<HTMLButtonElement> {}

export const FieldButtonClearButton = forwardRef<HTMLButtonElement, FieldButtonClearButtonProps>(
  (props, ref) => {
    const { clearButtonProps } = useFieldButtonContext();
    const mergedProps = mergeProps(clearButtonProps, props);

    return <Primitive.button ref={ref} {...mergedProps} />;
  },
);
FieldButtonClearButton.displayName = "FieldButtonClearButton";

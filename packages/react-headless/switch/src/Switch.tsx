"use client";

import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useSwitch, type UseSwitchProps } from "./useSwitch";
import { SwitchProvider, useSwitchContext } from "./useSwitchContext";

export interface SwitchRootProps
  extends UseSwitchProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLLabelElement> {}

export const SwitchRoot = forwardRef<HTMLLabelElement, SwitchRootProps>((props, ref) => {
  const { checked, defaultChecked, disabled, invalid, onCheckedChange, required, ...otherProps } =
    props;

  const api = useSwitch({
    checked,
    defaultChecked,
    disabled,
    invalid,
    onCheckedChange,
    required,
  });
  const mergedProps = mergeProps(api.rootProps, otherProps);

  return (
    <SwitchProvider value={api}>
      <Primitive.label ref={ref} {...mergedProps} />
    </SwitchProvider>
  );
});
SwitchRoot.displayName = "SwitchRoot";

export interface SwitchControlProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const SwitchControl = forwardRef<HTMLDivElement, SwitchControlProps>((props, ref) => {
  const { controlProps } = useSwitchContext();
  const mergedProps = mergeProps(controlProps, props);
  return <Primitive.div ref={ref} {...mergedProps} />;
});
SwitchControl.displayName = "SwitchControl";

export interface SwitchThumbProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const SwitchThumb = forwardRef<HTMLDivElement, SwitchThumbProps>((props, ref) => {
  const { thumbProps } = useSwitchContext();
  const mergedProps = mergeProps(thumbProps, props);
  return <Primitive.div ref={ref} {...mergedProps} />;
});
SwitchThumb.displayName = "SwitchThumb";

export interface SwitchHiddenInputProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLInputElement> {}

export const SwitchHiddenInput = forwardRef<HTMLInputElement, SwitchHiddenInputProps>(
  (props, ref) => {
    const { hiddenInputProps } = useSwitchContext();
    const mergedProps = mergeProps(hiddenInputProps, props);
    return <Primitive.input ref={ref} {...mergedProps} />;
  },
);
SwitchHiddenInput.displayName = "SwitchHiddenInput";

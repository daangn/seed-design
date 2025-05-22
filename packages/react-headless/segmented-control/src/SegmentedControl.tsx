"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import * as React from "react";
import {
  useSegmentedControl,
  type UseSegmentedControlItemProps,
  type UseSegmentedControlProps,
} from "./useSegmentedControl";
import { SegmentedControlProvider, useSegmentedControlContext } from "./useSegmentedControlContext";
import {
  SegmentedControlItemProvider,
  useSegmentedControlItemContext,
} from "./useSegmentedControlItemContext";

export interface SegmentedControlRootProps
  extends UseSegmentedControlProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {}

export const SegmentedControlRoot = React.forwardRef<HTMLDivElement, SegmentedControlRootProps>(
  (props, ref) => {
    const { value, defaultValue, onValueChange, form, name, disabled, ...otherProps } = props;

    const api = useSegmentedControl({
      value,
      defaultValue,
      onValueChange,
      disabled,
      form,
      name,
    });
    const mergedProps = mergeProps(api.rootProps, otherProps);

    return (
      <SegmentedControlProvider value={api}>
        <Primitive.div ref={composeRefs(ref, api.refs.root)} {...mergedProps} />
      </SegmentedControlProvider>
    );
  },
);
SegmentedControlRoot.displayName = "SegmentedControl";

export interface SegmentedControlItemProps
  extends UseSegmentedControlItemProps,
    PrimitiveProps,
    Omit<React.InputHTMLAttributes<HTMLLabelElement>, "value"> {}

export const SegmentedControlItem = React.forwardRef<
  HTMLLabelElement,
  UseSegmentedControlItemProps
>((props, ref) => {
  const { value, invalid, disabled, ...otherProps } = props;
  const { getItemProps } = useSegmentedControlContext();
  const itemProps = getItemProps({ value, disabled, invalid });
  const mergedProps = mergeProps(itemProps.rootProps, otherProps);

  return (
    <SegmentedControlItemProvider value={itemProps}>
      <Primitive.label ref={ref} {...mergedProps} />
    </SegmentedControlItemProvider>
  );
});
SegmentedControlItem.displayName = "SegmentedControlItem";

export interface SegmentedControlItemHiddenInputProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLInputElement> {}

export const SegmentedControlItemHiddenInput = React.forwardRef<
  HTMLInputElement,
  SegmentedControlItemHiddenInputProps
>((props, ref) => {
  const { hiddenInputProps } = useSegmentedControlItemContext();
  const mergedProps = mergeProps(hiddenInputProps, props);

  return <Primitive.input ref={ref} {...mergedProps} />;
});
SegmentedControlItemHiddenInput.displayName = "SegmentedControlItemHiddenInput";

"use client";

import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useToggle, type UseToggleProps } from "./useToggle";
import { ToggleProvider } from "./useToggleContext";

export interface ToggleRootProps
  extends UseToggleProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const ToggleRoot = forwardRef<HTMLButtonElement, ToggleRootProps>((props, ref) => {
  const { pressed, defaultPressed, onPressedChange, disabled, ...otherProps } = props;
  const api = useToggle({
    pressed,
    defaultPressed,
    onPressedChange,
    disabled,
  });
  const mergedProps = mergeProps(api.rootProps, otherProps);
  return (
    <ToggleProvider value={api}>
      <Primitive.button ref={ref} {...mergedProps} />
    </ToggleProvider>
  );
});
ToggleRoot.displayName = "ToggleRoot";

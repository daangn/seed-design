'use client';
import { Switch as SwitchPrimitive, useSwitchContext } from "@ride-developer/react-switch";
import { switchStyle, type SwitchVariantProps } from "@ride-developer/css/recipes/switch";
import { switchmark, type SwitchmarkVariantProps } from "@ride-developer/css/recipes/switchmark";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import { createWithStateProps } from "../../utils/createWithStateProps";
import React from "react";
import clsx from "clsx";
import { splitMultipleVariantsProps } from "../../utils/splitMultipleVariantsProps";

const { withContext, ClassNamesProvider } = createSlotRecipeContext(switchStyle);
const {
  withContext: withControlContext,
  PropsProvider: ControlPropsProvider,
  withProvider: withControlProvider,
} = createSlotRecipeContext(switchmark);
const withStateProps = createWithStateProps([useSwitchContext]);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `16` or `32` instead of `small` or `medium`.
 */
type SwitchVariantDeprecatedSizeProps = "small" | "medium";

export interface SwitchRootProps
  extends Omit<SwitchVariantProps, "size">,
    Omit<SwitchmarkVariantProps, "size">,
    SwitchPrimitive.RootProps {
  size?: SwitchVariantProps["size"] | SwitchVariantDeprecatedSizeProps;
}

export const SwitchRoot = React.forwardRef<HTMLLabelElement, SwitchRootProps>(
  ({ className, ...props }, ref) => {
    if (
      process.env.NODE_ENV !== "production" &&
      (props.size === "small" || props.size === "medium")
    ) {
      console.warn(
        `[Ride Design System] Switch size='${props.size}' is deprecated and will be removed in @ride-developer/react@2.0.0. Use size='${props.size === "small" ? "16" : "32"}' instead.`,
      );
    }

    const [{ switch: switchVariantProps, switchmark: switchmarkVariantProps }, otherProps] =
      splitMultipleVariantsProps(
        {
          ...props,
          // TODO: replace this mapping completely
          size: props.size === "small" ? "16" : props.size === "medium" ? "32" : props.size,
        },
        { switchmark, switch: switchStyle },
      );

    const classNames = switchStyle(switchVariantProps);

    return (
      <ControlPropsProvider value={switchmarkVariantProps}>
        <ClassNamesProvider value={classNames}>
          <SwitchPrimitive.Root
            ref={ref}
            className={clsx(classNames.root, className)}
            {...otherProps}
          />
        </ClassNamesProvider>
      </ControlPropsProvider>
    );
  },
);
SwitchRoot.displayName = "SwitchRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchControlProps extends SwitchmarkVariantProps, SwitchPrimitive.ControlProps {}

export const SwitchControl = withControlProvider<HTMLDivElement, SwitchControlProps>(
  SwitchPrimitive.Control,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchThumbProps extends SwitchPrimitive.ThumbProps {}

export const SwitchThumb = withControlContext<HTMLDivElement, SwitchThumbProps>(
  SwitchPrimitive.Thumb,
  "thumb",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const SwitchLabel = withContext<HTMLSpanElement, SwitchLabelProps>(
  withStateProps(Primitive.span),
  "label",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchHiddenInputProps extends SwitchPrimitive.HiddenInputProps {}

export const SwitchHiddenInput = SwitchPrimitive.HiddenInput;

import { Switch as SwitchPrimitive, useSwitchContext } from "@seed-design/react-switch";
import { switchStyle, type SwitchVariantProps } from "@seed-design/css/recipes/switch";
import {
  switchControl,
  type SwitchControlVariantProps,
} from "@seed-design/css/recipes/switch-control";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createWithStateProps } from "../../utils/createWithStateProps";
import React from "react";
import clsx from "clsx";
import { splitMultipleVariantProps } from "@seed-design/css/utils/splitMultipleVariantProps";

const { withContext, ClassNamesProvider, withProvider } = createSlotRecipeContext(switchStyle);
const {
  withContext: withControlContext,
  ClassNamesProvider: ControlClassNamesProvider,
  PropsProvider: ControlPropsProvider,
  withProvider: withControlProvider,
} = createSlotRecipeContext(switchControl);
const withStateProps = createWithStateProps([useSwitchContext]);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `16` or `32` instead of `small` or `medium`.
 */
type SwitchVariantDeprecatedSizeProps = "small" | "medium";

export interface SwitchRootProps
  extends Omit<SwitchVariantProps, "size">,
    SwitchPrimitive.RootProps {
  size?: SwitchVariantProps["size"] | SwitchVariantDeprecatedSizeProps;
}

export const SwitchRoot = React.forwardRef<HTMLLabelElement, SwitchRootProps>(
  ({ className, ...props }, ref) => {
    const [{ switch: switchVariantProps, switchControl: switchControlVariantProps }, otherProps] =
      splitMultipleVariantProps(
        {
          ...props,
          // TODO: replace this mapping completely
          size: props.size === "small" ? "16" : props.size === "medium" ? "32" : props.size,
        },
        { switchControl, switch: switchStyle },
      );

    const classNames = switchStyle(switchVariantProps);

    return (
      <ControlPropsProvider value={switchControlVariantProps}>
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

export interface SwitchControlProps
  extends SwitchControlVariantProps,
    SwitchPrimitive.ControlProps {}

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

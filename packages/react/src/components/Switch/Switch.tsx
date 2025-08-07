import { Switch as SwitchPrimitive, useSwitchContext } from "@seed-design/react-switch";
import { switchStyle, type SwitchVariantProps } from "@seed-design/css/recipes/switch";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createWithStateProps } from "../../utils/createWithStateProps";
import React from "react";
import clsx from "clsx";

const { withContext, ClassNamesProvider } = createSlotRecipeContext(switchStyle);
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
  ({ size: propSize, className, ...otherProps }, ref) => {
    const classNames = switchStyle({
      // TODO: remove this mapping completely
      size: propSize === "small" ? "16" : propSize === "medium" ? "32" : propSize,
    });

    return (
      <ClassNamesProvider value={classNames}>
        <SwitchPrimitive.Root
          ref={ref}
          className={clsx(classNames.root, className)}
          {...otherProps}
        />
      </ClassNamesProvider>
    );
  },
);

// XXX: use when the deprecated size props are removed

// export interface SwitchRootProps extends SwitchVariantProps, SwitchPrimitive.RootProps {}

// export const SwitchRoot = withProvider<HTMLLabelElement, SwitchRootProps>(
//   SwitchPrimitive.Root,
//   "root",
// );

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchControlProps extends SwitchPrimitive.ControlProps {}

export const SwitchControl = withContext<HTMLDivElement, SwitchControlProps>(
  SwitchPrimitive.Control,
  "control",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwitchThumbProps extends SwitchPrimitive.ThumbProps {}

export const SwitchThumb = withContext<HTMLDivElement, SwitchThumbProps>(
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

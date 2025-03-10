import { mergeProps } from "@seed-design/dom-utils";
import { Checkbox as CheckboxPrimitive, useCheckboxContext } from "@seed-design/react-checkbox";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { checkbox, type CheckboxVariantProps } from "@seed-design/css/recipes/checkbox";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon } from "../private/Icon";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(checkbox);
const withStateProps = createWithStateProps([useCheckboxContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxRootProps extends CheckboxVariantProps, CheckboxPrimitive.RootProps {}

export const CheckboxRoot = withProvider<HTMLLabelElement, CheckboxRootProps>(
  CheckboxPrimitive.Root,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxControlProps extends CheckboxPrimitive.ControlProps {}

export const CheckboxControl = withContext<HTMLDivElement, CheckboxControlProps>(
  CheckboxPrimitive.Control,
  "control",
);

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxIndicatorProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * The icon to display when the checkbox is unchecked.
   */
  unchecked?: React.ReactNode;

  /**
   * The icon to display when the checkbox is checked.
   */
  checked: React.ReactNode;

  /**
   * The icon to display when the checkbox is in an indeterminate state.
   */
  indeterminate?: React.ReactNode;
}

export const CheckboxIndicator = forwardRef<SVGSVGElement, CheckboxIndicatorProps>(
  (
    {
      unchecked: uncheckedSvg,
      checked: checkedSvg,
      indeterminate: indeterminateSvg,
      ...otherProps
    },
    ref,
  ) => {
    const { stateProps, checked, indeterminate } = useCheckboxContext();
    const classNames = useClassNames();

    const mergedProps = mergeProps(
      stateProps,
      { className: classNames.icon },
      otherProps as React.HTMLAttributes<HTMLElement>,
    );

    if (indeterminate && !indeterminateSvg) {
      console.warn(
        "CheckboxIndicator: the `indeterminate` prop must be provided when the checkbox is in an indeterminate state.",
      );
    }

    if (indeterminate) return <InternalIcon ref={ref} svg={indeterminateSvg} {...mergedProps} />;
    if (checked) return <InternalIcon ref={ref} svg={checkedSvg} {...mergedProps} />;
    if (uncheckedSvg) return <InternalIcon ref={ref} svg={uncheckedSvg} {...mergedProps} />;
    return null;
  },
);
CheckboxIndicator.displayName = "CheckboxIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const CheckboxLabel = withContext<HTMLDivElement, CheckboxLabelProps>(
  withStateProps(Primitive.span),
  "label",
);

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxHiddenInputProps extends CheckboxPrimitive.HiddenInputProps {}

export const CheckboxHiddenInput = CheckboxPrimitive.HiddenInput;

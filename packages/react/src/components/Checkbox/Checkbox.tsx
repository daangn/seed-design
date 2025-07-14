import { checkbox, type CheckboxVariantProps } from "@seed-design/css/recipes/checkbox";
import { checkmark, type CheckmarkVariantProps } from "@seed-design/css/recipes/checkmark";
import { mergeProps } from "@seed-design/dom-utils";
import { Checkbox as CheckboxPrimitive, useCheckboxContext } from "@seed-design/react-checkbox";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { forwardRef, useMemo } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon } from "../private/Icon";

const { ClassNamesProvider, withContext } = createSlotRecipeContext(checkbox);
const {
  withProvider: withCheckmarkProvider,
  useClassNames: useCheckmarkClassNames,
  PropsProvider: CheckmarkPropsProvider,
} = createSlotRecipeContext(checkmark);
const withStateProps = createWithStateProps([useCheckboxContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxRootProps
  extends CheckboxVariantProps,
    CheckmarkVariantProps,
    CheckboxPrimitive.RootProps {}

export const CheckboxRoot = Object.assign(
  forwardRef<HTMLLabelElement, CheckboxRootProps>((props, ref) => {
    const { variant, className, ...otherProps } = props;
    const [variantProps, restProps] = checkbox.splitVariantProps(otherProps);
    const classNames = checkbox(variantProps);

    return (
      <CheckmarkPropsProvider value={useMemo(() => ({ variant }), [variant])}>
        <ClassNamesProvider value={classNames}>
          <CheckboxPrimitive.Root
            ref={ref}
            className={clsx(classNames.root, className)}
            {...restProps}
          />
        </ClassNamesProvider>
      </CheckmarkPropsProvider>
    );
  }),
  {
    Primitive: CheckboxPrimitive.Root,
  },
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * CheckboxControl combines Checkbox.Primitive with checkmark.root styling
 * This enables standalone usage of Checkbox.Control with variants
 */

export interface CheckboxControlProps
  extends CheckmarkVariantProps,
    CheckboxPrimitive.ControlProps {}

export const CheckboxControl = withCheckmarkProvider<HTMLDivElement, CheckboxControlProps>(
  CheckboxPrimitive.Control,
  "root",
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
    const classNames = useCheckmarkClassNames();

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

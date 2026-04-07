import { checkbox, type CheckboxVariantProps } from "@ride-developer/css/recipes/checkbox";
import { checkmark, type CheckmarkVariantProps } from "@ride-developer/css/recipes/checkmark";
import { splitMultipleVariantsProps } from "../../utils/splitMultipleVariantsProps";
import { mergeProps } from "@seed-design/dom-utils";
import { Checkbox as CheckboxPrimitive, useCheckboxContext } from "@seed-design/react-checkbox";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon } from "../private/Icon";
import { createRecipeContext } from "../../utils/createRecipeContext";
import {
  checkboxGroup,
  type CheckboxGroupVariantProps,
} from "@ride-developer/css/recipes/checkbox-group";

const { withContext: withGroupContext } = createRecipeContext(checkboxGroup);
const { ClassNamesProvider, withContext } = createSlotRecipeContext(checkbox);
const {
  withProvider: withCheckmarkProvider,
  useClassNames: useCheckmarkClassNames,
  PropsProvider: CheckmarkPropsProvider,
} = createSlotRecipeContext(checkmark);
const withStateProps = createWithStateProps([useCheckboxContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface CheckboxGroupProps
  extends CheckboxGroupVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const CheckboxGroup = withGroupContext<HTMLDivElement, CheckboxGroupProps>(Primitive.div);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `regular` or `bold` instead of `default` or `stronger`
 */
type CheckboxVariantDeprecatedWeightProps = "default" | "stronger";

export interface CheckboxRootProps
  extends Omit<CheckboxVariantProps, "weight">,
    CheckmarkVariantProps,
    CheckboxPrimitive.RootProps {
  weight?: CheckboxVariantProps["weight"] | CheckboxVariantDeprecatedWeightProps;
}

export const CheckboxRoot = Object.assign(
  forwardRef<HTMLLabelElement, CheckboxRootProps>(({ className, ...props }, ref) => {
    if (
      process.env.NODE_ENV !== "production" &&
      (props.weight === "default" || props.weight === "stronger")
    ) {
      console.warn(
        `[SEED Design System] Checkbox weight='${props.weight}' is deprecated and will be removed in @seed-design/react@1.3.0. Use weight='${props.weight === "default" ? "regular" : "bold"}' instead.`,
      );
    }

    const [{ checkbox: checkboxVariantProps, checkmark: checkmarkVariantProps }, otherProps] =
      splitMultipleVariantsProps(
        {
          ...props,
          // TODO: replace this mapping completely
          weight:
            props.weight === "stronger"
              ? "bold"
              : props.weight === "default"
                ? "regular"
                : props.weight,
        },
        { checkbox, checkmark },
      );

    const classNames = checkbox(checkboxVariantProps);

    return (
      <CheckmarkPropsProvider value={checkmarkVariantProps}>
        <ClassNamesProvider value={classNames}>
          <CheckboxPrimitive.Root
            ref={ref}
            className={clsx(classNames.root, className)}
            {...otherProps}
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

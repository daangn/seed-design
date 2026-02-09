import { radio, type RadioVariantProps } from "@seed-design/css/recipes/radio";
import { radioGroup, type RadioGroupVariantProps } from "@seed-design/css/recipes/radio-group";
import { radiomark, type RadiomarkVariantProps } from "@seed-design/css/recipes/radiomark";
import { mergeProps } from "@seed-design/dom-utils";
import {
  RadioGroup as RadioGroupPrimitive,
  useRadioGroupItemContext,
} from "@seed-design/react-radio-group";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon } from "../private/Icon";
import { splitMultipleVariantsProps } from "../../utils/splitMultipleVariantsProps";
import { createRecipeContext } from "../../utils/createRecipeContext";

const { withContext: withGroupContext } = createRecipeContext(radioGroup);
const { ClassNamesProvider, withContext } = createSlotRecipeContext(radio);
const {
  withProvider: withRadiomarkProvider,
  useClassNames: useRadiomarkClassNames,
  PropsProvider: RadiomarkPropsProvider,
} = createSlotRecipeContext(radiomark);
const withStateProps = createWithStateProps([useRadioGroupItemContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupRootProps
  extends RadioGroupVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioGroupRoot = withGroupContext<HTMLDivElement, RadioGroupRootProps>(Primitive.div);

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemProps
  extends RadioVariantProps,
    RadiomarkVariantProps,
    RadioGroupPrimitive.ItemProps {}

export const RadioGroupItem = Object.assign(
  forwardRef<HTMLLabelElement, RadioGroupItemProps>(({ className, ...props }, ref) => {
    const [{ radio: radioVariantProps, radiomark: radiomarkVariantProps }, otherProps] =
      splitMultipleVariantsProps(props, { radio, radiomark });

    const classNames = radio(radioVariantProps);

    return (
      <RadiomarkPropsProvider value={radiomarkVariantProps}>
        <ClassNamesProvider value={classNames}>
          <RadioGroupPrimitive.Item
            ref={ref}
            className={clsx(classNames.root, className)}
            {...otherProps}
          />
        </ClassNamesProvider>
      </RadiomarkPropsProvider>
    );
  }),
  {
    Primitive: RadioGroupPrimitive.Item,
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const RadioGroupItemLabel = withContext<HTMLSpanElement, RadioGroupItemLabelProps>(
  withStateProps(Primitive.span),
  "label",
);

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemControlProps
  extends RadiomarkVariantProps,
    RadioGroupPrimitive.ItemControlProps {}

export const RadioGroupItemControl = withRadiomarkProvider<
  HTMLDivElement,
  RadioGroupItemControlProps
>(RadioGroupPrimitive.ItemControl, "root");

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemIndicatorProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * The icon to display when the radio is unchecked.
   */
  unchecked?: React.ReactNode;

  /**
   * The icon to display when the radio is checked.
   */
  checked?: React.ReactNode;
}

export const RadioGroupItemIndicator = forwardRef<SVGSVGElement, RadioGroupItemIndicatorProps>(
  ({ unchecked: uncheckedSvg, checked: checkedSvg, ...otherProps }, ref) => {
    const { stateProps, checked } = useRadioGroupItemContext();
    const classNames = useRadiomarkClassNames();

    const mergedProps = mergeProps(
      stateProps,
      { className: classNames.icon },
      otherProps as React.HTMLAttributes<HTMLElement>,
    );

    if (checked)
      return (
        <InternalIcon
          ref={ref}
          svg={
            checkedSvg ?? (
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="currentColor" />
              </svg>
            )
          }
          {...mergedProps}
        />
      );
    if (uncheckedSvg) return <InternalIcon ref={ref} svg={uncheckedSvg} {...mergedProps} />;
    return null;
  },
);
RadioGroupItemIndicator.displayName = "RadioGroupItemIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemHiddenInputProps extends RadioGroupPrimitive.ItemHiddenInputProps {}

export const RadioGroupItemHiddenInput = RadioGroupPrimitive.ItemHiddenInput;

import { radio, type RadioVariantProps } from "@seed-design/css/recipes/radio";
import { radiomark, type RadiomarkVariantProps } from "@seed-design/css/recipes/radiomark";
import { mergeProps } from "@seed-design/dom-utils";
import {
  RadioGroup as RadioGroupPrimitive,
  useRadioGroupItemContext,
} from "@seed-design/react-radio-group";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { forwardRef, useMemo } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon } from "../private/Icon";

const { ClassNamesProvider, withContext } = createSlotRecipeContext(radio);
const {
  withProvider: withRadiomarkProvider,
  useClassNames: useRadiomarkClassNames,
  PropsProvider: RadiomarkPropsProvider,
} = createSlotRecipeContext(radiomark);
const withStateProps = createWithStateProps([useRadioGroupItemContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupRootProps extends RadioGroupPrimitive.RootProps {}

export const RadioGroupRoot = RadioGroupPrimitive.Root;

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupItemProps
  extends RadioVariantProps,
    RadiomarkVariantProps,
    RadioGroupPrimitive.ItemProps {}

export const RadioGroupItem = Object.assign(
  forwardRef<HTMLLabelElement, RadioGroupItemProps>((props, ref) => {
    const { size, className, ...otherProps } = props;
    const [variantProps, restProps] = radio.splitVariantProps(otherProps);
    const classNames = radio(variantProps);

    return (
      <RadiomarkPropsProvider value={useMemo(() => ({ size }), [size])}>
        <ClassNamesProvider value={classNames}>
          <RadioGroupPrimitive.Item
            ref={ref}
            className={clsx(classNames.root, className)}
            {...restProps}
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

export interface RadioGroupItemControlProps extends RadioGroupPrimitive.ItemControlProps {}

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

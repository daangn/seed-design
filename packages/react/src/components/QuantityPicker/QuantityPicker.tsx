"use client";

import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  QuantityPicker as QuantityPickerPrimitive,
  useQuantityPickerContext,
} from "@seed-design/react-quantity-picker";
import {
  quantityPicker,
  type QuantityPickerVariantProps,
} from "@seed-design/css/recipes/quantity-picker";
import clsx from "clsx";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(quantityPicker);
const withStateProps = createWithStateProps([useQuantityPickerContext]);

function isQuantityPickerButton(child: React.ReactNode) {
  return (
    React.isValidElement(child) &&
    (child.type === QuantityPickerDecrementButton || child.type === QuantityPickerIncrementButton)
  );
}

function isQuantityPickerValueDisplay(child: React.ReactNode) {
  return React.isValidElement(child) && child.type === QuantityPickerValueDisplay;
}

function withDividers(children: React.ReactNode, dividerClassName: string) {
  const childArray = React.Children.toArray(children);

  return childArray.flatMap((child, index) => {
    const nextChild = childArray[index + 1];
    const shouldInsertDivider =
      (isQuantityPickerButton(child) && isQuantityPickerValueDisplay(nextChild)) ||
      (isQuantityPickerValueDisplay(child) && isQuantityPickerButton(nextChild));

    if (!shouldInsertDivider) return child;

    return [
      child,
      <Primitive.div
        key={`divider-${index.toString()}`}
        aria-hidden="true"
        className={dividerClassName}
      />,
    ];
  });
}

function getValueDisplayPlaceholder(max: number) {
  return String(max).replace(/\d/g, "0");
}

function renderIcon(
  icon: React.ReactNode,
  className: string,
  stateProps: { "data-disabled"?: string },
) {
  if (!React.isValidElement<{ className?: string }>(icon)) return icon;

  return React.cloneElement(
    icon as React.ReactElement<{
      className?: string;
      "aria-hidden"?: boolean;
      "data-disabled"?: string;
    }>,
    {
      "aria-hidden": true,
      className: clsx(icon.props.className, className),
      "data-disabled": stateProps["data-disabled"],
    },
  );
}

export type QuantityPickerRootProps = QuantityPickerVariantProps &
  QuantityPickerPrimitive.RootProps;

export const QuantityPickerRoot = React.forwardRef<HTMLDivElement, QuantityPickerRootProps>(
  (props, ref) => {
    const [variantProps, otherProps] = quantityPicker.splitVariantProps(props);
    const {
      children,
      className,
      removable: _removable,
      removeAriaLabel: _removeAriaLabel,
      ...rootProps
    } = otherProps;
    const classNames = quantityPicker(variantProps);
    const quantityPickerRootProps: QuantityPickerPrimitive.RootProps = props.removable
      ? {
          ...rootProps,
          removable: true,
          removeAriaLabel: props.removeAriaLabel,
        }
      : {
          ...rootProps,
          removable: false,
        };

    return (
      <ClassNamesProvider value={classNames}>
        <QuantityPickerPrimitive.Root
          ref={ref}
          className={clsx(classNames.root, className)}
          {...quantityPickerRootProps}
        >
          {withDividers(children, classNames.divider)}
        </QuantityPickerPrimitive.Root>
      </ClassNamesProvider>
    );
  },
);
QuantityPickerRoot.displayName = "QuantityPickerRoot";

interface QuantityPickerButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
}

export interface QuantityPickerDecrementButtonProps
  extends Omit<QuantityPickerPrimitive.DecrementButtonProps, "children">,
    QuantityPickerButtonProps {
  removeIcon?: React.ReactNode;
}

export const QuantityPickerDecrementButton = React.forwardRef<
  HTMLButtonElement,
  QuantityPickerDecrementButtonProps
>(({ children, className, icon, loadingIndicator, removeIcon, ...props }, ref) => {
  const classNames = useClassNames();
  const { decrementIconProps, decrementLoading, isRemoveButton } = useQuantityPickerContext();
  const content = decrementLoading
    ? loadingIndicator
    : isRemoveButton
      ? (removeIcon ?? icon)
      : icon;

  return (
    <QuantityPickerPrimitive.DecrementButton
      ref={ref}
      className={clsx(classNames.decrementButton, className)}
      {...props}
    >
      {renderIcon(content ?? children, classNames.decrementIcon, decrementIconProps)}
    </QuantityPickerPrimitive.DecrementButton>
  );
});
QuantityPickerDecrementButton.displayName = "QuantityPickerDecrementButton";

export interface QuantityPickerValueDisplayProps
  extends QuantityPickerPrimitive.ValueDisplayProps {}

export const QuantityPickerValueDisplay = withStateProps(
  React.forwardRef<HTMLSpanElement, QuantityPickerValueDisplayProps>(
    ({ className, ...props }, ref) => {
      const classNames = useClassNames();
      const { max, valueDisplayProps } = useQuantityPickerContext();

      return (
        <Primitive.span
          ref={ref}
          {...mergeProps(valueDisplayProps, props)}
          className={clsx(classNames.valueDisplay, className)}
        >
          <Primitive.span aria-hidden="true" className={classNames.valueDisplayPlaceholder}>
            {getValueDisplayPlaceholder(max)}
          </Primitive.span>
          <Primitive.span className={classNames.valueDisplayText}>
            {valueDisplayProps.children}
          </Primitive.span>
        </Primitive.span>
      );
    },
  ),
);
QuantityPickerValueDisplay.displayName = "QuantityPickerValueDisplay";

export interface QuantityPickerIncrementButtonProps
  extends Omit<QuantityPickerPrimitive.IncrementButtonProps, "children">,
    QuantityPickerButtonProps {}

export const QuantityPickerIncrementButton = React.forwardRef<
  HTMLButtonElement,
  QuantityPickerIncrementButtonProps
>(({ children, className, icon, loadingIndicator, ...props }, ref) => {
  const classNames = useClassNames();
  const { incrementIconProps, incrementLoading } = useQuantityPickerContext();
  const content = incrementLoading ? loadingIndicator : icon;

  return (
    <QuantityPickerPrimitive.IncrementButton
      ref={ref}
      className={clsx(classNames.incrementButton, className)}
      {...props}
    >
      {renderIcon(content ?? children, classNames.incrementIcon, incrementIconProps)}
    </QuantityPickerPrimitive.IncrementButton>
  );
});
QuantityPickerIncrementButton.displayName = "QuantityPickerIncrementButton";

export interface QuantityPickerHiddenInputProps extends QuantityPickerPrimitive.HiddenInputProps {}

export const QuantityPickerHiddenInput = QuantityPickerPrimitive.HiddenInput;

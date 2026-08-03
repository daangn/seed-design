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
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { usePressScale } from "../../utils/pressScale";

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
  ariaHidden: boolean,
) {
  if (!React.isValidElement<{ className?: string }>(icon)) return icon;

  return React.cloneElement(
    icon as React.ReactElement<{
      className?: string;
      "aria-hidden"?: boolean;
      "data-disabled"?: string;
    }>,
    {
      ...(ariaHidden ? { "aria-hidden": true } : {}),
      className: clsx(icon.props.className, className),
      "data-disabled": stateProps["data-disabled"],
    },
  );
}

export type QuantityPickerRootProps = Omit<QuantityPickerVariantProps, "size" | "layout"> &
  QuantityPickerPrimitive.RootProps & {
    /**
     * 컴포넌트의 크기입니다.
     * @default "medium"
     */
    size?: QuantityPickerVariantProps["size"];
    /**
     * 컴포넌트가 부모 Flex 레이아웃의 여유 공간을 채울지 지정합니다.
     * @since 2.2.0
     * @default "hug"
     */
    layout?: QuantityPickerVariantProps["layout"];
  };

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
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "type"> {
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
  const contentIsIcon = content !== null && content !== undefined;
  const { pressScaleRef, pressScaleClassName } = usePressScale();

  return (
    <QuantityPickerPrimitive.DecrementButton
      ref={useComposedRefs(pressScaleRef, ref)}
      className={clsx(classNames.decrementButton, pressScaleClassName, className)}
      {...props}
    >
      {renderIcon(content ?? children, classNames.decrementIcon, decrementIconProps, contentIsIcon)}
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
      const { getValueText, max, valueDisplayProps } = useQuantityPickerContext();
      const placeholder = getValueDisplayPlaceholder(max);

      return (
        <Primitive.span
          ref={ref}
          {...mergeProps(valueDisplayProps, props)}
          className={clsx(classNames.valueDisplay, className)}
        >
          <Primitive.span aria-hidden="true" className={classNames.valueDisplayPlaceholder}>
            {getValueText(placeholder, placeholder)}
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
  const contentIsIcon = content !== null && content !== undefined;
  const { pressScaleRef, pressScaleClassName } = usePressScale();

  return (
    <QuantityPickerPrimitive.IncrementButton
      ref={useComposedRefs(pressScaleRef, ref)}
      className={clsx(classNames.incrementButton, pressScaleClassName, className)}
      {...props}
    >
      {renderIcon(content ?? children, classNames.incrementIcon, incrementIconProps, contentIsIcon)}
    </QuantityPickerPrimitive.IncrementButton>
  );
});
QuantityPickerIncrementButton.displayName = "QuantityPickerIncrementButton";

export interface QuantityPickerHiddenInputProps extends QuantityPickerPrimitive.HiddenInputProps {}

export const QuantityPickerHiddenInput = QuantityPickerPrimitive.HiddenInput;

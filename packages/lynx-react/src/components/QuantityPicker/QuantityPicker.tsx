import {
  quantityPicker,
  type QuantityPickerSlotName,
  type QuantityPickerVariantProps,
} from "@seed-design/lynx-css/recipes/quantity-picker";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxAccessibilityProps,
  LynxIconElementProps,
  LynxStyledElementProps,
  LynxTouchProps,
  LynxViewRef,
} from "../../types";
import { mergeProps } from "../../utils/merge-props";
import { InternalIcon } from "../Icon/Icon";

export type QuantityPickerLoading =
  | boolean
  | {
      decrement?: boolean;
      increment?: boolean;
    };

export type QuantityPickerGetValueText = (
  valueText: string,
  value: number | string,
) => React.ReactNode;

const defaultGetValueText: QuantityPickerGetValueText = (valueText) => valueText;

type QuantityPickerRootBaseProps = Omit<LynxStyledElementProps, "children"> &
  LynxAccessibilityProps & {
    children?: React.ReactNode;
    min: number;
    max: number;
    step?: number;
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    disabled?: boolean;
    invalid?: boolean;
    readOnly?: boolean;
    loading?: QuantityPickerLoading;
    onRemove?: () => void;
    getValueText?: QuantityPickerGetValueText;
    dir?: "ltr" | "rtl";
    layout?: QuantityPickerVariantProps["layout"];
    size?: QuantityPickerVariantProps["size"];
  };

type QuantityPickerRemovableProps = {
  removable: true;
  removeAccessibilityLabel: string;
  onRemove: () => void;
};

type QuantityPickerNonRemovableProps = {
  removable?: false;
  removeAccessibilityLabel?: string;
};

export type QuantityPickerRootProps = QuantityPickerRootBaseProps &
  (QuantityPickerRemovableProps | QuantityPickerNonRemovableProps);

export interface QuantityPickerDecrementButtonProps
  extends LynxStyledElementProps,
    LynxTouchProps,
    LynxAccessibilityProps {
  icon?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
  removeIcon?: React.ReactNode;
}

export interface QuantityPickerValueDisplayProps
  extends Omit<LynxStyledElementProps, "children">,
    LynxAccessibilityProps {}

export interface QuantityPickerIncrementButtonProps
  extends LynxStyledElementProps,
    LynxTouchProps,
    LynxAccessibilityProps {
  icon?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
}

type QuantityPickerClassNames = Record<QuantityPickerSlotName, string>;

interface QuantityPickerContextValue {
  layout: QuantityPickerVariantProps["layout"];
  size: QuantityPickerVariantProps["size"];
  invalid: boolean;
  disabled: boolean;
  readOnly: boolean;
  loading: boolean;
  value: number;
  min: number;
  max: number;
  step: number;
  dir: "ltr" | "rtl";
  removable: boolean;
  isAtMin: boolean;
  isAtMax: boolean;
  isRemoveButton: boolean;
  removeAccessibilityLabel?: string;
  getValueText: QuantityPickerGetValueText;
  decrementLoading: boolean;
  incrementLoading: boolean;
  decrementBlocked: boolean;
  incrementBlocked: boolean;
  decrement: () => void;
  increment: () => void;
  onRemove?: () => void;
  classes: QuantityPickerClassNames;
}

const QuantityPickerContext = React.createContext<QuantityPickerContextValue | null>(null);

function useQuantityPickerContext(consumer: string): QuantityPickerContextValue {
  const context = React.useContext(QuantityPickerContext);
  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside <QuantityPickerRoot/>.`);
  }
  return context;
}

function assertSafeInteger(value: number | undefined, name: string): asserts value is number {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`QuantityPicker: ${name} must be a safe integer.`);
  }
}

function validateProps({
  defaultValue,
  max,
  min,
  step,
  value,
}: Pick<QuantityPickerRootProps, "defaultValue" | "max" | "min" | "step" | "value">) {
  assertSafeInteger(min, "min");
  assertSafeInteger(max, "max");
  assertSafeInteger(step, "step");

  if (min > max) {
    throw new Error("QuantityPicker: min must be less than or equal to max.");
  }
  if (step <= 0) {
    throw new Error("QuantityPicker: step must be greater than 0.");
  }

  for (const [name, candidate] of [
    ["value", value],
    ["defaultValue", defaultValue],
  ] as const) {
    if (candidate === undefined) continue;
    assertSafeInteger(candidate, name);
    if (candidate < min || candidate > max) {
      throw new Error(`QuantityPicker: ${name} must be between min and max.`);
    }
  }
}

function getLoadingState(loading: QuantityPickerLoading | undefined) {
  if (loading === true) return { decrement: true, increment: true };
  return {
    decrement: typeof loading === "object" ? (loading?.decrement ?? false) : false,
    increment: typeof loading === "object" ? (loading?.increment ?? false) : false,
  };
}

function getValueDisplayPlaceholder(min: number, max: number) {
  const boundary = String(min).length > String(max).length ? min : max;
  return String(boundary).replace(/\d/g, "0");
}

function getAccessibleText(valueText: React.ReactNode, value: number) {
  return typeof valueText === "string" || typeof valueText === "number"
    ? String(valueText)
    : String(value);
}

function recipeProps(
  context: Pick<QuantityPickerContextValue, "layout" | "size" | "invalid" | "disabled"> &
    Partial<Pick<QuantityPickerContextValue, "loading">>,
  pressed = false,
) {
  return {
    layout: context.layout,
    size: context.size,
    invalid: context.invalid,
    disabled: context.disabled,
    pressed,
    loading: context.loading ?? false,
  } as QuantityPickerVariantProps;
}

function isQuantityPickerButton(child: React.ReactNode) {
  return (
    React.isValidElement(child) &&
    (child.type === QuantityPickerDecrementButton || child.type === QuantityPickerIncrementButton)
  );
}

function isQuantityPickerValueDisplay(child: React.ReactNode) {
  return React.isValidElement(child) && child.type === QuantityPickerValueDisplay;
}
function flattenQuantityPickerChildren(children: React.ReactNode): React.ReactNode[] {
  if (children == null || typeof children === "boolean") return [];
  if (Array.isArray(children)) return children.flatMap(flattenQuantityPickerChildren);
  if (
    React.isValidElement<{ children?: React.ReactNode }>(children) &&
    children.type === React.Fragment
  ) {
    return flattenQuantityPickerChildren(children.props.children);
  }
  return [children];
}

function withDividers(children: React.ReactNode, dividerClassName: string) {
  const childArray = flattenQuantityPickerChildren(children);
  return childArray.flatMap((child, index) => {
    const nextChild = childArray[index + 1];
    const shouldInsertDivider =
      (isQuantityPickerButton(child) && isQuantityPickerValueDisplay(nextChild)) ||
      (isQuantityPickerValueDisplay(child) && isQuantityPickerButton(nextChild));
    if (!shouldInsertDivider) return [child];
    return [
      child,
      <view
        key={
          isQuantityPickerValueDisplay(child)
            ? "quantity-picker-divider-after-value"
            : "quantity-picker-divider-before-value"
        }
        accessibility-elements-hidden={true}
        className={dividerClassName}
      />,
    ];
  });
}

function renderActionContent(
  icon: React.ReactNode,
  loadingIndicator: React.ReactNode,
  children: React.ReactNode,
  className: string,
  loading: boolean,
) {
  if (loading) {
    const content = loadingIndicator ?? children;
    return (
      <view className={className} accessibility-elements-hidden={true}>
        {typeof content === "string" || typeof content === "number" ? (
          <text>{content}</text>
        ) : (
          content
        )}
      </view>
    );
  }

  if (icon == null) {
    return typeof children === "string" || typeof children === "number" ? (
      <text className={className}>{children}</text>
    ) : (
      children
    );
  }

  if (typeof icon === "string" || typeof icon === "number") {
    return <text className={className}>{icon}</text>;
  }

  if (!React.isValidElement<LynxIconElementProps>(icon)) return icon;
  return <InternalIcon icon={icon} className={className} accessibility-elements-hidden={true} />;
}

export const QuantityPickerRoot = React.forwardRef<unknown, QuantityPickerRootProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      min,
      max,
      step: stepProp = 1,
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled = false,
      invalid = false,
      readOnly = false,
      loading,
      onRemove,
      getValueText = defaultGetValueText,
      dir = "ltr",
      removable = false,
      removeAccessibilityLabel,
      layout: layoutProp = "hug",
      size: sizeProp = "medium",
      "accessibility-element": accessibilityElement = true,
      "accessibility-role-description": accessibilityRoleDescription = "quantity picker",
      "accessibility-traits": accessibilityTraits,
      "accessibility-value": accessibilityValue,
      ...nativeProps
    } = props;

    validateProps({ min, max, step: stepProp, value: valueProp, defaultValue });
    const initialValue = defaultValue ?? min;
    assertSafeInteger(initialValue, "defaultValue");
    if (initialValue < min || initialValue > max) {
      throw new Error("QuantityPicker: defaultValue must be between min and max.");
    }

    const [value, setValue] = useControllableState({
      value: valueProp,
      defaultValue: initialValue,
      onChange: onValueChange,
    });
    const loadingState = getLoadingState(loading);
    const isAtMin = value === min;
    const isAtMax = value === max;
    const isRemoveButton = removable && isAtMin;
    const decrementDisabled = disabled || (!isRemoveButton && isAtMin);
    const incrementDisabled = disabled || isAtMax;
    const decrementBlocked = decrementDisabled || readOnly || loadingState.decrement;
    const incrementBlocked = incrementDisabled || readOnly || loadingState.increment;

    const decrement = React.useCallback(() => {
      "background only";
      if (isRemoveButton) {
        if (!decrementBlocked) onRemove?.();
        return;
      }
      if (!decrementBlocked) setValue(Math.max(value - stepProp, min));
    }, [decrementBlocked, isRemoveButton, min, onRemove, setValue, stepProp, value]);
    const increment = React.useCallback(() => {
      "background only";
      if (!incrementBlocked) setValue(Math.min(value + stepProp, max));
    }, [incrementBlocked, max, setValue, stepProp, value]);

    const classes = quantityPicker(
      recipeProps({
        layout: layoutProp,
        size: sizeProp,
        invalid,
        disabled,
        loading: loadingState.decrement || loadingState.increment,
      }),
    );
    const displayValue = getValueText(String(value), value);
    const contextValue = React.useMemo<QuantityPickerContextValue>(
      () => ({
        layout: layoutProp,
        size: sizeProp,
        invalid,
        disabled,
        readOnly,
        loading: loadingState.decrement || loadingState.increment,
        value,
        min,
        max,
        step: stepProp,
        dir,
        removable,
        isAtMin,
        isAtMax,
        isRemoveButton,
        removeAccessibilityLabel,
        getValueText,
        decrementLoading: loadingState.decrement,
        incrementLoading: loadingState.increment,
        decrementBlocked,
        incrementBlocked,
        decrement,
        increment,
        onRemove,
        classes,
      }),
      [
        classes,
        decrement,
        decrementBlocked,
        disabled,
        dir,
        getValueText,
        increment,
        incrementBlocked,
        invalid,
        isAtMax,
        isAtMin,
        isRemoveButton,
        loadingState.decrement,
        loadingState.increment,
        max,
        min,
        onRemove,
        readOnly,
        removeAccessibilityLabel,
        removable,
        layoutProp,
        sizeProp,
        value,
      ],
    );

    const orderedChildren = flattenQuantityPickerChildren(children);
    if (dir === "rtl") orderedChildren.reverse();
    return (
      <QuantityPickerContext.Provider value={contextValue}>
        <view
          {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
          className={clsx(classes.root, className)}
          style={style}
          accessibility-element={accessibilityElement}
          accessibility-role-description={accessibilityRoleDescription}
          accessibility-traits={accessibilityTraits ?? (disabled ? "disabled" : undefined)}
          accessibility-value={accessibilityValue ?? getAccessibleText(displayValue, value)}
        >
          {withDividers(orderedChildren, classes.divider)}
        </view>
      </QuantityPickerContext.Provider>
    );
  },
);
QuantityPickerRoot.displayName = "QuantityPickerRoot";

export const QuantityPickerDecrementButton = React.forwardRef<
  unknown,
  QuantityPickerDecrementButtonProps
>((props, ref) => {
  const context = useQuantityPickerContext("QuantityPickerDecrementButton");
  const {
    children,
    className,
    style,
    icon,
    loadingIndicator,
    removeIcon,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription = "button",
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressHandlers } = usePressTap({
    disabled: context.decrementBlocked,
    onTap: (...args) => {
      context.decrement();
      bindtap?.(...args);
    },
    mainThreadOnTap: mainThreadBindtap,
  });
  const classes = quantityPicker(
    recipeProps(
      { ...context, loading: context.decrementLoading, disabled: context.decrementBlocked },
      pressed && !context.decrementBlocked,
    ),
  );
  const scaleFeedback = useScaleFeedback({
    disabled: context.decrementBlocked,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });
  const iconContent = context.isRemoveButton ? (removeIcon ?? icon) : icon;
  return (
    <view
      {...mergeProps(
        ref ? { ref: ref as LynxViewRef } : {},
        scaleFeedback.scaleFeedbackTargetProps,
        scaleFeedback.scaleFeedbackTriggerProps,
        pressHandlers,
        nativeProps,
      )}
      className={clsx(classes.decrementButton, className)}
      style={style}
      accessibility-element={accessibilityElement}
      accessibility-label={
        context.isRemoveButton ? context.removeAccessibilityLabel : accessibilityLabel
      }
      accessibility-role-description={accessibilityRoleDescription}
      accessibility-traits={
        accessibilityTraits ?? (context.decrementBlocked ? "disabled" : "button")
      }
    >
      {renderActionContent(
        iconContent,
        loadingIndicator,
        children,
        classes.decrementIcon,
        context.decrementLoading,
      )}
    </view>
  );
});
QuantityPickerDecrementButton.displayName = "QuantityPickerDecrementButton";

export const QuantityPickerValueDisplay = React.forwardRef<
  unknown,
  QuantityPickerValueDisplayProps
>((props, ref) => {
  const context = useQuantityPickerContext("QuantityPickerValueDisplay");
  const {
    className,
    style,
    "accessibility-elements-hidden": accessibilityElementsHidden = true,
    ...nativeProps
  } = props;
  const valueText = context.getValueText(String(context.value), context.value);
  const placeholderText = getValueDisplayPlaceholder(context.min, context.max);
  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(quantityPicker(recipeProps(context)).valueDisplay, className)}
      style={style}
      accessibility-elements-hidden={accessibilityElementsHidden}
    >
      <text
        accessibility-elements-hidden={true}
        className={quantityPicker(recipeProps(context)).valueDisplayPlaceholder}
      >
        {context.getValueText(placeholderText, placeholderText)}
      </text>
      <text className={quantityPicker(recipeProps(context)).valueDisplayText}>{valueText}</text>
    </view>
  );
});
QuantityPickerValueDisplay.displayName = "QuantityPickerValueDisplay";

export const QuantityPickerIncrementButton = React.forwardRef<
  unknown,
  QuantityPickerIncrementButtonProps
>((props, ref) => {
  const context = useQuantityPickerContext("QuantityPickerIncrementButton");
  const {
    children,
    className,
    style,
    icon,
    loadingIndicator,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription = "button",
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressHandlers } = usePressTap({
    disabled: context.incrementBlocked,
    onTap: (...args) => {
      context.increment();
      bindtap?.(...args);
    },
    mainThreadOnTap: mainThreadBindtap,
  });
  const classes = quantityPicker(
    recipeProps(
      { ...context, loading: context.incrementLoading, disabled: context.incrementBlocked },
      pressed && !context.incrementBlocked,
    ),
  );
  const scaleFeedback = useScaleFeedback({
    disabled: context.incrementBlocked,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });
  return (
    <view
      {...mergeProps(
        ref ? { ref: ref as LynxViewRef } : {},
        scaleFeedback.scaleFeedbackTargetProps,
        scaleFeedback.scaleFeedbackTriggerProps,
        pressHandlers,
        nativeProps,
      )}
      className={clsx(classes.incrementButton, className)}
      style={style}
      accessibility-element={accessibilityElement}
      accessibility-label={accessibilityLabel}
      accessibility-role-description={accessibilityRoleDescription}
      accessibility-traits={
        accessibilityTraits ?? (context.incrementBlocked ? "disabled" : "button")
      }
    >
      {renderActionContent(
        icon,
        loadingIndicator,
        children,
        classes.incrementIcon,
        context.incrementLoading,
      )}
    </view>
  );
});
QuantityPickerIncrementButton.displayName = "QuantityPickerIncrementButton";

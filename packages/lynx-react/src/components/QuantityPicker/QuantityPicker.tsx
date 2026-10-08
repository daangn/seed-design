import {
  quantityPicker,
  type QuantityPickerSlotName,
  type QuantityPickerVariantProps,
} from "@seed-design/lynx-css/recipes/quantity-picker";
import {
  QuantityPickerProvider,
  QuantityPickerValueDisplay as HeadlessQuantityPickerValueDisplay,
  useQuantityPicker,
  useQuantityPickerContext,
  useQuantityPickerDecrementButton,
  useQuantityPickerIncrementButton,
  type UseQuantityPickerContext,
  type UseQuantityPickerProps,
} from "@seed-design/lynx-react-quantity-picker";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type { LynxIconElementProps, LynxHostProps, LynxViewRef } from "../../types";
import { mergeProps } from "../../utils/merge-props";
import { InternalIcon } from "../Icon/Icon";

export type {
  QuantityPickerGetValueText,
  QuantityPickerLoading,
} from "@seed-design/lynx-react-quantity-picker";

export type QuantityPickerRootProps = Omit<LynxHostProps<"view">, keyof UseQuantityPickerProps> & {
  layout?: QuantityPickerVariantProps["layout"];
  size?: QuantityPickerVariantProps["size"];
} & UseQuantityPickerProps;

export interface QuantityPickerDecrementButtonProps extends LynxHostProps<"view"> {
  icon?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
  removeIcon?: React.ReactNode;
}

export interface QuantityPickerValueDisplayProps extends Omit<LynxHostProps<"view">, "children"> {}

export interface QuantityPickerIncrementButtonProps extends LynxHostProps<"view"> {
  icon?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
}

interface StyledQuantityPickerContextValue extends UseQuantityPickerContext {
  layout: QuantityPickerVariantProps["layout"];
  size: QuantityPickerVariantProps["size"];
  classes: Record<QuantityPickerSlotName, string>;
}

function isStyledQuantityPickerContext(
  context: UseQuantityPickerContext,
): context is StyledQuantityPickerContextValue {
  return "classes" in context;
}

function useStyledQuantityPickerContext(consumer: string): StyledQuantityPickerContextValue {
  const context = useQuantityPickerContext();
  if (!isStyledQuantityPickerContext(context)) {
    throw new Error(`<${consumer}/> must be rendered inside a styled <QuantityPickerRoot/>.`);
  }
  return context;
}

function getValueDisplayPlaceholder(min: number, max: number) {
  const boundary = String(min).length > String(max).length ? min : max;
  return String(boundary).replace(/\d/g, "0");
}

function recipeProps(
  context: Pick<StyledQuantityPickerContextValue, "layout" | "size" | "invalid" | "disabled">,
  loading: boolean,
  pressed = false,
) {
  return {
    layout: context.layout,
    size: context.size,
    invalid: context.invalid,
    disabled: context.disabled,
    pressed,
    loading,
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

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-quantity-picker`의 수량 상태·Remove·loading 차단·접근성 위에
 * SEED recipe, divider, 아이콘·loading 표시와 Scale Feedback을 조립한다.
 */
export const QuantityPickerRoot = React.forwardRef<unknown, QuantityPickerRootProps>(
  (props, ref) => {
    const api = useQuantityPicker(props);
    const { loading: _loading, ...propsWithoutLoading } = props;
    const [variantProps, otherProps] = quantityPicker.splitVariantProps(propsWithoutLoading);
    const { layout = "hug", size = "medium" } = variantProps;
    const {
      children,
      className,
      min: _min,
      max: _max,
      step: _step,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      readOnly: _readOnly,
      onRemove: _onRemove,
      getValueText: _getValueText,
      dir: _dir,
      removable: _removable,
      removeAccessibilityLabel: _removeAccessibilityLabel,
      ...nativeProps
    } = otherProps;

    const classes = quantityPicker(
      recipeProps(
        { layout, size, invalid: api.invalid, disabled: api.disabled },
        api.decrementLoading || api.incrementLoading,
      ),
    );
    const contextValue = React.useMemo<StyledQuantityPickerContextValue>(
      () => ({ ...api, layout, size, classes }),
      [api, layout, size, classes],
    );

    const orderedChildren = flattenQuantityPickerChildren(children);
    if (api.dir === "rtl") orderedChildren.reverse();
    return (
      <QuantityPickerProvider value={contextValue}>
        <view
          {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, api.rootProps, nativeProps)}
          className={clsx(classes.root, className)}
        >
          {withDividers(orderedChildren, classes.divider)}
        </view>
      </QuantityPickerProvider>
    );
  },
);
QuantityPickerRoot.displayName = "QuantityPickerRoot";

export const QuantityPickerDecrementButton = React.forwardRef<
  unknown,
  QuantityPickerDecrementButtonProps
>((props, ref) => {
  const context = useStyledQuantityPickerContext("QuantityPickerDecrementButton");
  const {
    children,
    className,
    icon,
    loadingIndicator,
    removeIcon,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const { interactive, loading, pressed, isRemoveButton, buttonProps } =
    useQuantityPickerDecrementButton({
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits,
    });
  // Press state follows the Scale Feedback Main Thread touch handlers.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...actionProps } = buttonProps;
  const classes = quantityPicker(
    recipeProps({ ...context, disabled: !interactive }, loading, pressed),
  );
  const scaleFeedback = useScaleFeedback({
    disabled: !interactive,
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
        actionProps,
        nativeProps,
      )}
      className={clsx(classes.decrementButton, className)}
    >
      {renderActionContent(
        isRemoveButton ? (removeIcon ?? icon) : icon,
        loadingIndicator,
        children,
        classes.decrementIcon,
        loading,
      )}
    </view>
  );
});
QuantityPickerDecrementButton.displayName = "QuantityPickerDecrementButton";

export const QuantityPickerValueDisplay = React.forwardRef<
  unknown,
  QuantityPickerValueDisplayProps
>((props, ref) => {
  const context = useStyledQuantityPickerContext("QuantityPickerValueDisplay");
  const { className, ...nativeProps } = props;
  const classes = quantityPicker(
    recipeProps(context, context.decrementLoading || context.incrementLoading),
  );
  const placeholderText = getValueDisplayPlaceholder(context.min, context.max);
  return (
    <HeadlessQuantityPickerValueDisplay
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(classes.valueDisplay, className)}
    >
      <text accessibility-elements-hidden={true} className={classes.valueDisplayPlaceholder}>
        {context.getValueText(placeholderText, placeholderText)}
      </text>
      <text className={classes.valueDisplayText}>{context.valueText}</text>
    </HeadlessQuantityPickerValueDisplay>
  );
});
QuantityPickerValueDisplay.displayName = "QuantityPickerValueDisplay";

export const QuantityPickerIncrementButton = React.forwardRef<
  unknown,
  QuantityPickerIncrementButtonProps
>((props, ref) => {
  const context = useStyledQuantityPickerContext("QuantityPickerIncrementButton");
  const {
    children,
    className,
    icon,
    loadingIndicator,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const { interactive, loading, pressed, buttonProps } = useQuantityPickerIncrementButton({
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
  });
  // Press state follows the Scale Feedback Main Thread touch handlers.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...actionProps } = buttonProps;
  const classes = quantityPicker(
    recipeProps({ ...context, disabled: !interactive }, loading, pressed),
  );
  const scaleFeedback = useScaleFeedback({
    disabled: !interactive,
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
        actionProps,
        nativeProps,
      )}
      className={clsx(classes.incrementButton, className)}
    >
      {renderActionContent(icon, loadingIndicator, children, classes.incrementIcon, loading)}
    </view>
  );
});
QuantityPickerIncrementButton.displayName = "QuantityPickerIncrementButton";

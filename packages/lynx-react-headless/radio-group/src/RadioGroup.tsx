import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useRadioGroup, type UseRadioGroupProps } from "./useRadioGroup.js";
import { RadioGroupProvider, useRadioGroupContext } from "./useRadioGroupContext.js";
import { useRadioGroupItem, type UseRadioGroupItemProps } from "./useRadioGroupItem.js";
import { RadioGroupItemProvider, useRadioGroupItemContext } from "./useRadioGroupItemContext.js";

type ViewProps = IntrinsicElements["view"];
type TextProps = IntrinsicElements["text"];

export interface RadioGroupRootProps
  extends UseRadioGroupProps,
    Omit<ViewProps, keyof UseRadioGroupProps> {}

/**
 * 스타일 없이 RadioGroup의 선택 값·disabled·invalid·접근성을 하위 요소에 제공하는 native `<view>`입니다.
 * 하위 요소는 `useRadioGroupContext`로 `value`·`disabled`·`invalid`를 읽습니다.
 */
export const RadioGroupRoot = React.forwardRef<unknown, RadioGroupRootProps>((props, ref) => {
  const {
    children,
    value,
    defaultValue,
    onValueChange,
    disabled,
    invalid,
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const api = useRadioGroup({
    value,
    defaultValue,
    onValueChange,
    disabled,
    invalid,
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
  });

  return (
    <RadioGroupProvider value={api}>
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps} {...api.rootProps}>
        {children}
      </view>
    </RadioGroupProvider>
  );
});
RadioGroupRoot.displayName = "RadioGroupRoot";

export interface RadioGroupLabelProps extends TextProps {}

/**
 * 그룹 이름을 표시하는 무스타일 native `<text>`입니다. `RadioGroupRoot` 안에서만 렌더링합니다.
 * Lynx에는 id 기반 label 연결이 없으므로 Root에 `accessibility-label`을 따로 지정합니다.
 */
export const RadioGroupLabel = React.forwardRef<unknown, RadioGroupLabelProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  useRadioGroupContext();

  return (
    <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
      {children}
    </text>
  );
});
RadioGroupLabel.displayName = "RadioGroupLabel";

export interface RadioGroupDescriptionProps extends TextProps {}

/**
 * 보조 설명을 표시하는 무스타일 native `<text>`입니다. `RadioGroupRoot` 안에서만 렌더링합니다.
 */
export const RadioGroupDescription = React.forwardRef<unknown, RadioGroupDescriptionProps>(
  (props, ref) => {
    const { children, ...nativeProps } = props;
    useRadioGroupContext();

    return (
      <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
        {children}
      </text>
    );
  },
);
RadioGroupDescription.displayName = "RadioGroupDescription";

export interface RadioGroupErrorMessageProps extends TextProps {}

/**
 * 오류 메시지를 표시하는 무스타일 native `<text>`입니다. `RadioGroupRoot` 안에서만 렌더링합니다.
 * 표시 여부는 consumer가 `invalid` 등으로 결정합니다.
 */
export const RadioGroupErrorMessage = React.forwardRef<unknown, RadioGroupErrorMessageProps>(
  (props, ref) => {
    const { children, ...nativeProps } = props;
    useRadioGroupContext();

    return (
      <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
        {children}
      </text>
    );
  },
);
RadioGroupErrorMessage.displayName = "RadioGroupErrorMessage";

export interface RadioGroupItemProps
  extends UseRadioGroupItemProps,
    Omit<ViewProps, keyof UseRadioGroupItemProps> {}

/**
 * 스타일 없이 Item 선택·press·접근성을 연결하는 native `<view>`입니다.
 * 하위 요소는 `useRadioGroupItemContext`로 `checked`·`disabled`·`pressed`를 읽습니다.
 */
export const RadioGroupItem = React.forwardRef<unknown, RadioGroupItemProps>((props, ref) => {
  const {
    children,
    value,
    disabled,
    bindtap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    ...nativeProps
  } = props;
  const api = useRadioGroupItem({
    value,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
  });
  const {
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
    ...itemProps
  } = api.itemProps;

  return (
    <RadioGroupItemProvider value={api}>
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        {...nativeProps}
        {...itemProps}
        bindtouchstart={(event) => {
          bindtouchstart?.(event);
          pressStart(event);
        }}
        bindtouchend={(event) => {
          bindtouchend?.(event);
          pressEnd(event);
        }}
        bindtouchcancel={(event) => {
          bindtouchcancel?.(event);
          pressCancel(event);
        }}
      >
        {children}
      </view>
    </RadioGroupItemProvider>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export interface RadioGroupItemControlProps extends ViewProps {}

/**
 * 선택 상태를 표시하는 무스타일 native `<view>`입니다. `RadioGroupItem` 안에서만 렌더링합니다.
 * press와 접근성 요소는 Item이 소유합니다.
 */
export const RadioGroupItemControl = React.forwardRef<unknown, RadioGroupItemControlProps>(
  (props, ref) => {
    const { children, ...nativeProps } = props;
    useRadioGroupItemContext();

    return (
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {children}
      </view>
    );
  },
);
RadioGroupItemControl.displayName = "RadioGroupItemControl";

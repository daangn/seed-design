import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useQuantityPicker, type UseQuantityPickerProps } from "./useQuantityPicker.js";
import {
  useQuantityPickerDecrementButton,
  useQuantityPickerIncrementButton,
  type UseQuantityPickerButtonProps,
  type UseQuantityPickerButtonReturn,
} from "./useQuantityPickerButton.js";
import { QuantityPickerProvider, useQuantityPickerContext } from "./useQuantityPickerContext.js";

type ViewProps = IntrinsicElements["view"];
type TouchHandler = NonNullable<ViewProps["bindtouchstart"]>;

type QuantityPickerHookPropName =
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "min"
  | "max"
  | "step"
  | "disabled"
  | "invalid"
  | "readOnly"
  | "loading"
  | "onRemove"
  | "getValueText"
  | "dir"
  | "removable"
  | "removeAccessibilityLabel";

function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  if (children == null || typeof children === "boolean") return [];
  if (Array.isArray(children)) return children.flatMap(flattenChildren);
  if (
    React.isValidElement<{ children?: React.ReactNode }>(children) &&
    children.type === React.Fragment
  ) {
    return flattenChildren(children.props.children);
  }
  return [children];
}

export type QuantityPickerRootProps = UseQuantityPickerProps &
  Omit<ViewProps, QuantityPickerHookPropName | "children"> & {
    children?: React.ReactNode;
  };

/**
 * 스타일 없이 수량 상태를 공유하는 native `<view>`입니다. Root는 기본적으로 접근성 요소가 아니며 버튼과 ValueDisplay가 독립적으로 노출됩니다.
 * `dir="rtl"`이면 Fragment를 펼친 자식 순서를 뒤집습니다. 하위 요소는 `useQuantityPickerContext`로 상태를 읽습니다.
 */
export const QuantityPickerRoot = React.forwardRef<unknown, QuantityPickerRootProps>(
  (props, ref) => {
    const {
      children,
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      step,
      disabled,
      invalid,
      readOnly,
      loading,
      onRemove,
      getValueText,
      dir,
      removable,
      removeAccessibilityLabel,
      // Root 이름은 ValueDisplay가 현재 수량과 함께 노출한다. Root에도 두면 같은 이름이 두 번 나온다.
      "accessibility-label": _accessibilityLabel,
      ...nativeProps
    } = props;
    const api = useQuantityPicker(props);
    const orderedChildren = api.dir === "rtl" ? flattenChildren(children).reverse() : children;

    return (
      <QuantityPickerProvider value={api}>
        <view
          {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
          {...api.rootProps}
          {...nativeProps}
        >
          {orderedChildren}
        </view>
      </QuantityPickerProvider>
    );
  },
);
QuantityPickerRoot.displayName = "QuantityPickerRoot";

interface QuantityPickerButtonProps
  extends UseQuantityPickerButtonProps,
    Omit<ViewProps, keyof UseQuantityPickerButtonProps> {}

function useQuantityPickerButtonView(
  props: QuantityPickerButtonProps,
  ref: React.ForwardedRef<unknown>,
  useButton: (props: UseQuantityPickerButtonProps) => UseQuantityPickerButtonReturn,
) {
  const {
    children,
    bindtap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const { buttonProps } = useButton({
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
  });
  const {
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
  } = buttonProps;

  return (
    <view
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      {...buttonProps}
      {...nativeProps}
      bindtouchstart={(event: Parameters<TouchHandler>[0]) => {
        bindtouchstart?.(event);
        pressStart(event);
      }}
      bindtouchend={(event: Parameters<TouchHandler>[0]) => {
        bindtouchend?.(event);
        pressEnd(event);
      }}
      bindtouchcancel={(event: Parameters<TouchHandler>[0]) => {
        bindtouchcancel?.(event);
        pressCancel(event);
      }}
    >
      {children}
    </view>
  );
}

export interface QuantityPickerDecrementButtonProps extends QuantityPickerButtonProps {}

/**
 * 스타일 없이 Decrement(Remove) action의 tap·눌림 상태·접근성을 연결하는 native `<view>`입니다.
 * 아이콘과 loading 표시는 소비자가 `useQuantityPickerContext`의 `isRemoveButton`·`decrementLoading`으로 고릅니다.
 */
export const QuantityPickerDecrementButton = React.forwardRef<
  unknown,
  QuantityPickerDecrementButtonProps
>((props, ref) => useQuantityPickerButtonView(props, ref, useQuantityPickerDecrementButton));
QuantityPickerDecrementButton.displayName = "QuantityPickerDecrementButton";

export interface QuantityPickerIncrementButtonProps extends QuantityPickerButtonProps {}

/**
 * 스타일 없이 Increment action의 tap·눌림 상태·접근성을 연결하는 native `<view>`입니다.
 */
export const QuantityPickerIncrementButton = React.forwardRef<
  unknown,
  QuantityPickerIncrementButtonProps
>((props, ref) => useQuantityPickerButtonView(props, ref, useQuantityPickerIncrementButton));
QuantityPickerIncrementButton.displayName = "QuantityPickerIncrementButton";

export interface QuantityPickerValueDisplayProps extends ViewProps {}

/**
 * 표시 텍스트(`valueText`)와 Root의 접근성 이름·현재 수량을 독립 접근성 요소로 노출하는 native `<view>`입니다.
 * 기본 `<text>`는 중복 노출을 막기 위해 접근성 트리에서 숨깁니다. `children`을 주면 기본 `<text>` 대신 렌더링합니다.
 */
export const QuantityPickerValueDisplay = React.forwardRef<
  unknown,
  QuantityPickerValueDisplayProps
>((props, ref) => {
  const { children, ...nativeProps } = props;
  const { valueText, valueDisplayProps } = useQuantityPickerContext();

  return (
    <view
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      {...valueDisplayProps}
      {...nativeProps}
    >
      {children ?? (
        <text accessibility-element={false} accessibility-elements-hidden={true}>
          {valueText}
        </text>
      )}
    </view>
  );
});
QuantityPickerValueDisplay.displayName = "QuantityPickerValueDisplay";

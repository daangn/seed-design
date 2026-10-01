import * as React from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { useFieldButton, type UseFieldButtonProps } from "./useFieldButton.js";
import {
  useFieldButtonButton,
  useFieldButtonClearButton,
  type FieldButtonPressableNativeProps,
  type UseFieldButtonPressableProps,
} from "./useFieldButtonButton.js";
import { FieldButtonProvider, useFieldButtonContext } from "./useFieldButtonContext.js";

type ViewProps = IntrinsicElements["view"];
type TextProps = IntrinsicElements["text"];

export interface FieldButtonRootProps
  extends UseFieldButtonProps,
    Omit<ViewProps, keyof UseFieldButtonProps> {}

/**
 * 스타일 없이 FieldButton 상태를 하위 요소에 제공하는 native `<view>`입니다.
 * 선택값은 소비자가 `values`로 소유하고, 표시할 내용은 children으로 직접 렌더링합니다.
 */
export const FieldButtonRoot = React.forwardRef<NodesRef, FieldButtonRootProps>((props, ref) => {
  const { children, values, onValuesChange, disabled, invalid, readOnly, ...nativeProps } = props;
  const api = useFieldButton({ values, onValuesChange, disabled, invalid, readOnly });

  return (
    <FieldButtonProvider value={api}>
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {children}
      </view>
    </FieldButtonProvider>
  );
});
FieldButtonRoot.displayName = "FieldButtonRoot";

type PressableViewProps = UseFieldButtonPressableProps &
  Omit<ViewProps, keyof UseFieldButtonPressableProps>;

function renderPressableView(
  props: PressableViewProps,
  ref: React.ForwardedRef<unknown>,
  nativeProps: FieldButtonPressableNativeProps,
) {
  const {
    children,
    bindtap: _bindtap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": _mainThreadBindtap,
    "main-thread:bindtouchstart": _mainThreadBindtouchstart,
    "main-thread:bindtouchend": _mainThreadBindtouchend,
    "main-thread:bindtouchcancel": _mainThreadBindtouchcancel,
    "accessibility-element": _accessibilityElement,
    "accessibility-traits": _accessibilityTraits,
    ...otherProps
  } = props;
  const {
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
    ...pressableProps
  } = nativeProps;

  return (
    <view
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      {...otherProps}
      {...pressableProps}
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
  );
}

export interface FieldButtonButtonProps extends PressableViewProps {}

/**
 * 값을 고르는 동작을 시작하는 무스타일 native `<view>`입니다. `FieldButtonRoot` 안에서만 렌더링합니다.
 */
export const FieldButtonButton = React.forwardRef<unknown, FieldButtonButtonProps>((props, ref) => {
  const { buttonProps } = useFieldButtonButton(props);
  return renderPressableView(props, ref, buttonProps);
});
FieldButtonButton.displayName = "FieldButtonButton";

export interface FieldButtonClearButtonProps extends PressableViewProps {}

/**
 * tap하면 `onValuesChange([])`를 요청하는 무스타일 native `<view>`입니다.
 * Root가 `disabled`·`readOnly`이면 렌더링하지 않습니다. 아이콘만 둘 때는 `accessibility-label`을 지정합니다.
 */
export const FieldButtonClearButton = React.forwardRef<unknown, FieldButtonClearButtonProps>(
  (props, ref) => {
    const { rendered, clearButtonProps } = useFieldButtonClearButton(props);
    if (!rendered) return null;
    return renderPressableView(props, ref, clearButtonProps);
  },
);
FieldButtonClearButton.displayName = "FieldButtonClearButton";

export interface FieldButtonDescriptionProps extends TextProps {}

/**
 * 보조 설명을 표시하는 무스타일 native `<text>`입니다. `FieldButtonRoot` 안에서만 렌더링합니다.
 * Lynx에는 id 기반 설명 연결이 없으므로 Button의 `accessibility-label`에 필요한 내용을 포함합니다.
 */
export const FieldButtonDescription = React.forwardRef<unknown, FieldButtonDescriptionProps>(
  (props, ref) => {
    const { children, ...nativeProps } = props;
    useFieldButtonContext();

    return (
      <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
        {children}
      </text>
    );
  },
);
FieldButtonDescription.displayName = "FieldButtonDescription";

export interface FieldButtonErrorMessageProps extends TextProps {}

/**
 * 오류 메시지를 표시하는 무스타일 native `<text>`입니다. `FieldButtonRoot` 안에서만 렌더링합니다.
 * 표시 여부는 consumer가 `invalid` 등으로 결정합니다.
 */
export const FieldButtonErrorMessage = React.forwardRef<unknown, FieldButtonErrorMessageProps>(
  (props, ref) => {
    const { children, ...nativeProps } = props;
    useFieldButtonContext();

    return (
      <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
        {children}
      </text>
    );
  },
);
FieldButtonErrorMessage.displayName = "FieldButtonErrorMessage";

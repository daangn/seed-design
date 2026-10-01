import * as React from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { useField, type UseFieldProps } from "./useField.js";
import { FieldProvider, useFieldContext } from "./useFieldContext.js";

type ViewProps = IntrinsicElements["view"];
type TextProps = IntrinsicElements["text"];

export interface FieldRootProps extends UseFieldProps, Omit<ViewProps, keyof UseFieldProps> {}

/**
 * 스타일 없이 Field 상태를 하위 요소에 제공하는 native `<view>`입니다.
 * 전달한 ref와 `useFieldContext().rootRef`가 같은 node를 가리킵니다.
 */
export const FieldRoot = React.forwardRef<NodesRef, FieldRootProps>((props, forwardedRef) => {
  const { children, required, disabled, readOnly, invalid, ...nativeProps } = props;
  const api = useField({ required, disabled, readOnly, invalid });
  const { rootRef } = api;

  const ref = React.useMemo<React.Ref<NodesRef>>(() => {
    if (!forwardedRef) return rootRef;
    return (node: NodesRef | null) => {
      "background only";
      rootRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else forwardedRef.current = node;
    };
  }, [forwardedRef, rootRef]);

  return (
    <FieldProvider value={api}>
      <view ref={ref as ViewProps["ref"]} {...nativeProps}>
        {children}
      </view>
    </FieldProvider>
  );
});
FieldRoot.displayName = "FieldRoot";

export interface FieldLabelProps extends TextProps {}

/**
 * Field 이름을 표시하는 무스타일 native `<text>`입니다. `FieldRoot` 안에서만 렌더링합니다.
 * Lynx에는 label과 입력의 id 연결이 없으므로 입력에 `accessibility-label`을 따로 지정합니다.
 */
export const FieldLabel = React.forwardRef<unknown, FieldLabelProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  useFieldContext();

  return (
    <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
      {children}
    </text>
  );
});
FieldLabel.displayName = "FieldLabel";

export interface FieldDescriptionProps extends TextProps {}

/**
 * 보조 설명을 표시하는 무스타일 native `<text>`입니다. `FieldRoot` 안에서만 렌더링합니다.
 */
export const FieldDescription = React.forwardRef<unknown, FieldDescriptionProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  useFieldContext();

  return (
    <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
      {children}
    </text>
  );
});
FieldDescription.displayName = "FieldDescription";

export interface FieldErrorMessageProps extends TextProps {}

/**
 * 오류 메시지를 표시하는 무스타일 native `<text>`입니다. `FieldRoot` 안에서만 렌더링합니다.
 * 표시 여부는 consumer가 `invalid` 등으로 결정합니다.
 */
export const FieldErrorMessage = React.forwardRef<unknown, FieldErrorMessageProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  useFieldContext();

  return (
    <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
      {children}
    </text>
  );
});
FieldErrorMessage.displayName = "FieldErrorMessage";

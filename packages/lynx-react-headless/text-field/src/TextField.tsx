import * as React from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { useTextField, type UseTextFieldProps } from "./useTextField.js";
import { TextFieldProvider } from "./useTextFieldContext.js";
import { useTextFieldInput, type UseTextFieldInputProps } from "./useTextFieldInput.js";

type ViewProps = IntrinsicElements["view"];
type NativeInputProps = IntrinsicElements["input"];
type NativeTextareaProps = IntrinsicElements["textarea"];

export interface TextFieldRootProps
  extends UseTextFieldProps,
    Omit<ViewProps, keyof UseTextFieldProps> {}

/**
 * 스타일 없이 TextField 상태를 하위 입력 파트에 제공하는 native `<view>`입니다.
 * 전달한 ref와 `useTextFieldContext().rootRef`가 같은 node를 가리킵니다.
 */
export const TextFieldRoot = React.forwardRef<NodesRef, TextFieldRootProps>(
  (props, forwardedRef) => {
    const {
      children,
      value,
      defaultValue,
      onValueChange,
      required,
      disabled,
      readOnly,
      invalid,
      name,
      nativeInsertionMaxLength,
      ...nativeProps
    } = props;
    const api = useTextField({
      value,
      defaultValue,
      onValueChange,
      required,
      disabled,
      readOnly,
      invalid,
      name,
      nativeInsertionMaxLength,
    });
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
      <TextFieldProvider value={api}>
        <view ref={ref as ViewProps["ref"]} {...nativeProps}>
          {children}
        </view>
      </TextFieldProvider>
    );
  },
);
TextFieldRoot.displayName = "TextFieldRoot";

export interface TextFieldInputProps
  extends UseTextFieldInputProps,
    Omit<NativeInputProps, keyof UseTextFieldInputProps | "ref"> {}

/**
 * 무스타일 native `<input>`입니다. `TextFieldRoot` 안에서만 렌더링합니다.
 * `readOnly`이면 native focus·selection·편집 메뉴를 없애기 위해 값(비어 있으면 `placeholder`)을
 * `<text>`로 렌더링합니다. `type="password"`이면 값을 `•`로 가립니다. 이때 ref는 `<text>`를 가리킵니다.
 */
export const TextFieldInput = React.forwardRef<NodesRef, TextFieldInputProps>((props, ref) => {
  const api = useTextFieldInput(props, ref);

  if (api.readOnly) {
    const text =
      api.value === ""
        ? props.placeholder
        : props.type === "password"
          ? Array.from(api.value, () => "•").join("")
          : api.value;

    return <text {...(api.readOnlyTextProps as IntrinsicElements["text"])}>{text}</text>;
  }

  return <input {...(api.inputProps as NativeInputProps)} />;
});
TextFieldInput.displayName = "TextFieldInput";

export interface TextFieldTextareaProps
  extends UseTextFieldInputProps,
    Omit<NativeTextareaProps, keyof UseTextFieldInputProps | "ref"> {}

/**
 * 무스타일 native `<textarea>`입니다. `TextFieldRoot` 안에서만 렌더링합니다.
 * 크기가 바뀌면 KeyboardAvoidingScrollView에 알려 내용에 따라 높이가 늘어나도 입력이 키보드에 가리지 않게 합니다.
 * `readOnly`이면 값(비어 있으면 `placeholder`)을 `<text>`로 렌더링하며 ref는 `<text>`를 가리킵니다.
 */
export const TextFieldTextarea = React.forwardRef<NodesRef, TextFieldTextareaProps>(
  (props, ref) => {
    const api = useTextFieldInput(props, ref);
    const { notifyLayoutChanged } = api;
    const { bindlayoutchange } = props;
    const handleLayoutChange = React.useCallback<
      NonNullable<NativeTextareaProps["bindlayoutchange"]>
    >(
      (event) => {
        "background only";

        notifyLayoutChanged();
        bindlayoutchange?.(event);
      },
      [bindlayoutchange, notifyLayoutChanged],
    );

    if (api.readOnly) {
      return (
        <text {...(api.readOnlyTextProps as IntrinsicElements["text"])}>
          {api.value === "" ? props.placeholder : api.value}
        </text>
      );
    }

    return (
      <textarea
        {...(api.inputProps as NativeTextareaProps)}
        bindlayoutchange={handleLayoutChange}
      />
    );
  },
);
TextFieldTextarea.displayName = "TextFieldTextarea";

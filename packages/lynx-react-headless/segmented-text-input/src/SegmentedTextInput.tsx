import * as React from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { TextFieldProvider } from "@seed-design/lynx-react-text-field";
import { useSegmentedTextInput, type UseSegmentedTextInputProps } from "./useSegmentedTextInput.js";
import { SegmentedTextInputProvider } from "./useSegmentedTextInputContext.js";
import {
  useSegmentedTextInputSegment,
  useSegmentedTextInputSegmentInput,
  type UseSegmentedTextInputSegmentInputProps,
} from "./useSegmentedTextInputSegment.js";

type ViewProps = IntrinsicElements["view"];
type NativeInputProps = IntrinsicElements["input"];

export interface SegmentedTextInputRootProps
  extends UseSegmentedTextInputProps,
    Omit<ViewProps, keyof UseSegmentedTextInputProps> {}

/**
 * 스타일 없이 SegmentedTextInput 상태를 하위 Segment에 제공하는 native `<view>`입니다.
 * 전달한 ref와 `useSegmentedTextInputContext().rootRef`가 같은 node를 가리킵니다.
 */
export const SegmentedTextInputRoot = React.forwardRef<NodesRef, SegmentedTextInputRootProps>(
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
      ...nativeProps
    } = props;
    const api = useSegmentedTextInput({
      value,
      defaultValue,
      onValueChange,
      required,
      disabled,
      readOnly,
      invalid,
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
      <SegmentedTextInputProvider value={api}>
        <view ref={ref as ViewProps["ref"]} {...nativeProps}>
          {children}
        </view>
      </SegmentedTextInputProvider>
    );
  },
);
SegmentedTextInputRoot.displayName = "SegmentedTextInputRoot";

export interface SegmentedTextInputSegmentProps
  extends Omit<UseSegmentedTextInputSegmentInputProps, "segmentKey">,
    Omit<NativeInputProps, keyof UseSegmentedTextInputSegmentInputProps | "ref"> {}

/**
 * 무스타일 입력 Segment입니다. Segment마다 native `<input>` 하나를 렌더링합니다.
 * `readOnly`이면 값(비어 있으면 `placeholder`)을 `<text>`로 렌더링하고, `masked`이면 값을 `•`로 가립니다.
 */
export const SegmentedTextInputSegment = React.forwardRef<NodesRef, SegmentedTextInputSegmentProps>(
  (props, ref) => {
    const { segmentKey, textField } = useSegmentedTextInputSegment({ length: props.length });

    return (
      <TextFieldProvider value={textField}>
        <SegmentedTextInputSegmentInput {...props} segmentKey={segmentKey} ref={ref} />
      </TextFieldProvider>
    );
  },
);
SegmentedTextInputSegment.displayName = "SegmentedTextInputSegment";

const SegmentedTextInputSegmentInput = React.forwardRef<
  NodesRef,
  SegmentedTextInputSegmentProps & { segmentKey: object }
>((props, ref) => {
  const api = useSegmentedTextInputSegmentInput(props, ref);

  if (api.readOnly) {
    const text =
      api.value === ""
        ? props.placeholder
        : props.masked
          ? Array.from(api.value, () => "•").join("")
          : api.value;

    return <text {...(api.readOnlyTextProps as IntrinsicElements["text"])}>{text}</text>;
  }

  return <input {...(api.inputProps as NativeInputProps)} />;
});
SegmentedTextInputSegmentInput.displayName = "SegmentedTextInputSegmentInput";

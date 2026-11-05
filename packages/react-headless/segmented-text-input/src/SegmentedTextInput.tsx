"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useSegmentedTextInput, type UseSegmentedTextInputProps } from "./useSegmentedTextInput";
import {
  SegmentedTextInputProvider,
  useSegmentedTextInputContext,
} from "./useSegmentedTextInputContext";
import {
  useSegmentedTextInputSegment,
  type UseSegmentedTextInputSegmentProps,
} from "./useSegmentedTextInputSegment";

export interface SegmentedTextInputRootProps
  extends UseSegmentedTextInputProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {}

export const SegmentedTextInputRoot = forwardRef<HTMLDivElement, SegmentedTextInputRootProps>(
  (props, ref) => {
    const {
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      invalid,
      required,
      ...otherProps
    } = props;

    const api = useSegmentedTextInput({
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      invalid,
      required,
    });

    const mergedProps = mergeProps(api.rootProps, otherProps);

    return (
      <SegmentedTextInputProvider value={api}>
        <Primitive.div ref={composeRefs(api.rootRef, ref)} {...mergedProps} />
      </SegmentedTextInputProvider>
    );
  },
);
SegmentedTextInputRoot.displayName = "SegmentedTextInputRoot";

export interface SegmentedTextInputSegmentProps
  extends UseSegmentedTextInputSegmentProps,
    PrimitiveProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "value" | "defaultValue" | "type" | "maxLength" | keyof UseSegmentedTextInputSegmentProps
    > {}

export const SegmentedTextInputSegment = forwardRef<
  HTMLInputElement,
  SegmentedTextInputSegmentProps
>((props, ref) => {
  const { length, masked, inputMode, autoComplete, normalize, ...otherProps } = props;
  const { inputRef, inputProps } = useSegmentedTextInputSegment({
    length,
    masked,
    inputMode,
    autoComplete,
    normalize,
  });
  const mergedProps = mergeProps(inputProps, otherProps);

  return <Primitive.input ref={composeRefs(inputRef, ref)} {...mergedProps} />;
});
SegmentedTextInputSegment.displayName = "SegmentedTextInputSegment";

export interface SegmentedTextInputSeparatorProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Segment 사이의 장식용 구분자. 보조기기에서 읽지 않는다.
 */
export const SegmentedTextInputSeparator = forwardRef<
  HTMLSpanElement,
  SegmentedTextInputSeparatorProps
>((props, ref) => {
  const { stateProps } = useSegmentedTextInputContext();
  const mergedProps = mergeProps(stateProps, { "aria-hidden": true }, props);

  return <Primitive.span ref={ref} {...mergedProps} />;
});
SegmentedTextInputSeparator.displayName = "SegmentedTextInputSeparator";

export interface SegmentedTextInputStaticTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

/**
 * 정적 불릿처럼 입력값이 아닌 고정 텍스트. 보조기기에서 읽지 않는다.
 */
export const SegmentedTextInputStaticText = forwardRef<
  HTMLSpanElement,
  SegmentedTextInputStaticTextProps
>((props, ref) => {
  const { stateProps } = useSegmentedTextInputContext();
  const mergedProps = mergeProps(stateProps, { "aria-hidden": true }, props);

  return <Primitive.span ref={ref} {...mergedProps} />;
});
SegmentedTextInputStaticText.displayName = "SegmentedTextInputStaticText";

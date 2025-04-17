import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useGraphemeInput, type UseGraphemeInputProps } from "./useGraphemeInput";
import { GraphemeInputProvider, useGraphemeInputContext } from "./useGraphemeInputContext";

export interface GraphemeInputRootProps extends UseGraphemeInputProps {
  children: React.ReactNode;
}

export const GraphemeInputRoot = (props: GraphemeInputRootProps) => {
  const {
    value,
    defaultValue,
    onValueChange,
    readOnly,
    disabled,
    invalid,
    required,
    maxGraphemeCount,
    enforceMaxGraphemeCount,
    children,
  } = props;

  const api = useGraphemeInput({
    value,
    defaultValue,
    onValueChange,
    disabled,
    invalid,
    required,
    readOnly,
    maxGraphemeCount,
    enforceMaxGraphemeCount,
  });

  return <GraphemeInputProvider value={api}>{children}</GraphemeInputProvider>;
};

export interface GraphemeInputInputProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLInputElement> {}

export const GraphemeInputInput = forwardRef<HTMLInputElement, GraphemeInputInputProps>(
  (props, ref) => {
    const { inputProps } = useGraphemeInputContext();
    const mergedProps = mergeProps(inputProps, props);
    return <Primitive.input ref={ref} {...mergedProps} />;
  },
);
GraphemeInputInput.displayName = "GraphemeInputInput";

export interface GraphemeInputTextareaProps
  extends PrimitiveProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const GraphemeInputTextarea = forwardRef<HTMLTextAreaElement, GraphemeInputTextareaProps>(
  (props, ref) => {
    const { inputProps } = useGraphemeInputContext();
    const mergedProps = mergeProps(inputProps, props);
    return <Primitive.textarea ref={ref} {...mergedProps} />;
  },
);
GraphemeInputTextarea.displayName = "GraphemeInputTextarea";

export interface GraphemeInputCountProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const GraphemeInputCount = forwardRef<HTMLSpanElement, GraphemeInputCountProps>(
  (props, ref) => {
    const { stateProps, graphemes } = useGraphemeInputContext();
    const mergedProps = mergeProps(stateProps, props);
    return (
      <Primitive.span ref={ref} {...mergedProps}>
        {graphemes.length}
      </Primitive.span>
    );
  },
);
GraphemeInputCount.displayName = "GraphemeInputCount";

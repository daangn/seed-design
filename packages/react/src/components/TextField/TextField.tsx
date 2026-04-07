import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import { TextField, useTextFieldContext } from "@ride-developer/react-text-field";
import { useFieldContext } from "@ride-developer/react-field";
import { textInput, type TextInputVariantProps } from "@ride-developer/css/recipes/text-input";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef, useCallback, useRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon, type InternalIconProps } from "../private/Icon";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@ride-developer/dom-utils";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(textInput);

const withFieldStateProps = createWithStateProps([{ useContext: useFieldContext, strict: false }]);
const withStateProps = createWithStateProps([
  useTextFieldContext,
  { useContext: useFieldContext, strict: false },
]);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldRootProps extends TextInputVariantProps, TextField.RootProps {}

export const TextFieldRoot = withProvider<HTMLDivElement, TextFieldRootProps>(
  withFieldStateProps(TextField.Root),
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldPrefixIconProps extends InternalIconProps {}

export const TextFieldPrefixIcon = withContext<SVGSVGElement, TextFieldPrefixIconProps>(
  withStateProps(InternalIcon),
  "prefixIcon",
);

export interface TextFieldPrefixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TextFieldPrefixText = withContext<HTMLSpanElement, TextFieldPrefixTextProps>(
  withStateProps(Primitive.span),
  "prefixText",
);

export interface TextFieldSuffixIconProps extends InternalIconProps {}

export const TextFieldSuffixIcon = withContext<SVGSVGElement, TextFieldSuffixIconProps>(
  withStateProps(InternalIcon),
  "suffixIcon",
);

export interface TextFieldSuffixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TextFieldSuffixText = withContext<HTMLSpanElement, TextFieldSuffixTextProps>(
  withStateProps(Primitive.span),
  "suffixText",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldInputProps extends TextField.InputProps {}

export const TextFieldInput = forwardRef<HTMLInputElement, TextFieldInputProps>(
  ({ className, ...otherProps }, ref) => {
    const classNames = useClassNames();
    const textFieldContext = useTextFieldContext();
    const fieldContext = useFieldContext({ strict: false });

    const mergedProps = mergeProps(
      fieldContext ? fieldContext.stateProps : {},
      fieldContext ? fieldContext.inputAriaAttributes : {},
      textFieldContext.inputProps,
      fieldContext ? fieldContext.inputProps : {},
      otherProps,
    );

    if (
      // if not in field, then must have aria-label or aria-labelledby
      !fieldContext &&
      !otherProps["aria-label"] &&
      !otherProps["aria-labelledby"]
    ) {
      console.warn(
        "TextFieldInput: Please provide `aria-label` or `aria-labelledby` for accessibility, or put `TextFieldInput` inside a `Field` where a `FieldLabel` is provided.",
      );
    }

    return (
      <TextField.Input ref={ref} {...mergedProps} className={clsx(classNames.value, className)} />
    );
  },
);
TextFieldInput.displayName = "TextFieldInput";

export interface TextFieldTextareaProps extends TextField.TextareaProps {
  /**
   * If true, the textarea will automatically resize based on its content.
   * @default true
   */
  autoresize?: boolean;
}

export const TextFieldTextarea = forwardRef<HTMLTextAreaElement, TextFieldTextareaProps>(
  ({ className, autoresize = true, ...otherProps }, ref) => {
    const classNames = useClassNames();
    const textFieldContext = useTextFieldContext();
    const fieldContext = useFieldContext({ strict: false });

    const mergedProps = mergeProps(
      fieldContext ? fieldContext.stateProps : {},
      fieldContext ? fieldContext.inputAriaAttributes : {},
      textFieldContext.inputProps,
      fieldContext ? fieldContext.inputProps : {},
      otherProps,
    );

    if (
      // if not in field, then must have aria-label or aria-labelledby
      !fieldContext &&
      !otherProps["aria-label"] &&
      !otherProps["aria-labelledby"]
    ) {
      console.warn(
        "TextFieldTextarea: Please provide `aria-label` or `aria-labelledby` for accessibility, or put `TextFieldTextarea` inside a `Field` where a `FieldLabel` is provided.",
      );
    }

    // referenced from React Spectrum
    const inputRef = useRef<HTMLTextAreaElement>(null);
    // biome-ignore lint/correctness/useExhaustiveDependencies: intended
    const onHeightChange = useCallback(() => {
      if (!inputRef.current) return;
      if (otherProps.style?.height) return;
      if (!autoresize) return;

      // Quiet textareas always grow based on their text content.
      // Standard textareas also grow by default, unless an explicit height is set.

      const input = inputRef.current;
      const prevAlignment = input.style.alignSelf;
      const prevOverflow = input.style.overflow;
      // Firefox scroll position is lost when overflow: 'hidden' is applied so we skip applying it.
      // The measure/applied height is also incorrect/reset if we turn on and off
      // overflow: hidden in Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1787062
      const isFirefox = "MozAppearance" in input.style;
      if (!isFirefox) {
        input.style.overflow = "hidden";
      }

      input.style.alignSelf = "start";
      input.style.height = "auto";

      // offsetHeight - clientHeight accounts for the border/padding.
      input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`;

      input.style.overflow = prevOverflow;
      input.style.alignSelf = prevAlignment;
    }, [inputRef, otherProps.style?.height, autoresize]);

    useLayoutEffect(() => {
      if (inputRef.current) {
        onHeightChange();
      }
    }, [onHeightChange, textFieldContext.value, inputRef]);

    return (
      <TextField.Textarea
        ref={composeRefs(inputRef, ref)}
        {...mergedProps}
        className={clsx(classNames.value, className)}
      />
    );
  },
);
TextFieldTextarea.displayName = "TextFieldTextarea";

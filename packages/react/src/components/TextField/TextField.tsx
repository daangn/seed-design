import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  Field,
  useFieldContext,
  GraphemeInput,
  useGraphemeInputContext,
} from "@seed-design/react-field";
import { textField, type TextFieldVariantProps } from "@seed-design/css/recipes/text-field";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef, useCallback, useRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon, type InternalIconProps } from "../private/Icon";
import { composeRefs } from "@radix-ui/react-compose-refs";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(textField);
const withStateProps = createWithStateProps([useFieldContext, useGraphemeInputContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldRootProps extends TextFieldVariantProps, TextField.RootProps {}

export const TextFieldRoot = withProvider<HTMLDivElement, TextFieldRootProps>(
  TextField.Root,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const TextFieldHeader = withContext<HTMLDivElement, TextFieldHeaderProps>(
  withStateProps(Primitive.div),
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldLabelProps extends TextField.LabelProps {}

export const TextFieldLabel = withContext<HTMLLabelElement, TextFieldLabelProps>(
  TextField.Label,
  "label",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldIndicatorProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TextFieldIndicator = forwardRef<HTMLSpanElement, TextFieldIndicatorProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;
    const classNames = useClassNames();

    return (
      <>
        <Primitive.span> </Primitive.span>
        <Primitive.span
          ref={ref}
          className={clsx(classNames.indicator, className)}
          {...otherProps}
        />
      </>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldFieldProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const TextFieldField = withContext<HTMLDivElement, TextFieldFieldProps>(
  withStateProps(Primitive.div),
  "field",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldPrefixIconProps extends InternalIconProps {}

export const TextFieldPrefixIcon = withContext<SVGSVGElement, TextFieldPrefixIconProps>(
  withStateProps(InternalIcon),
  "prefixIcon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldPrefixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TextFieldPrefixText = withContext<HTMLSpanElement, TextFieldPrefixTextProps>(
  withStateProps(Primitive.span),
  "prefixText",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldSuffixIconProps extends InternalIconProps {}

export const TextFieldSuffixIcon = withContext<SVGSVGElement, TextFieldSuffixIconProps>(
  withStateProps(InternalIcon),
  "suffixIcon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldSuffixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TextFieldSuffixText = withContext<HTMLSpanElement, TextFieldSuffixTextProps>(
  withStateProps(Primitive.span),
  "suffixText",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldInputProps extends TextField.InputProps {}

export const TextFieldInput = withContext<HTMLInputElement, TextFieldInputProps>(
  TextField.Input,
  "value",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldTextareaProps extends TextField.TextareaProps {
  /**
   * If true, the textarea will automatically resize based on its content.
   * @default true
   */
  autoresize?: boolean;
}

export const TextFieldTextarea = forwardRef<HTMLTextAreaElement, TextFieldTextareaProps>(
  (props, ref) => {
    const { className, autoresize = true, ...otherProps } = props;
    const classNames = useClassNames();
    const { value } = useTextFieldContext();

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
    }, [onHeightChange, value, inputRef]);

    return (
      <TextField.Textarea
        ref={composeRefs(inputRef, ref)}
        {...otherProps}
        className={clsx(classNames.value, className)}
      />
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const TextFieldFooter = withContext<HTMLDivElement, TextFieldFooterProps>(
  withStateProps(Primitive.div),
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldDescriptionProps extends TextField.DescriptionProps {}

export const TextFieldDescription = withContext<HTMLSpanElement, TextFieldDescriptionProps>(
  TextField.Description,
  "description",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldErrorMessageProps extends TextField.ErrorMessageProps {}

export const TextFieldErrorMessage = withContext<HTMLSpanElement, TextFieldErrorMessageProps>(
  TextField.ErrorMessage,
  "errorMessage",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldErrorIconProps extends InternalIconProps {}

export const TextFieldErrorIcon = withContext<SVGSVGElement, TextFieldErrorIconProps>(
  withStateProps(InternalIcon),
  "errorIcon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldCharacterCountAreaProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const TextFieldCharacterCountArea = withContext<
  HTMLDivElement,
  TextFieldCharacterCountAreaProps
>(withStateProps(Primitive.div), "characterCountArea");

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldCharacterCountProps extends TextField.GraphemeCountProps {}

export const TextFieldCharacterCount = withContext<HTMLDivElement, TextFieldCharacterCountProps>(
  TextField.GraphemeCount,
  "characterCount",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldMaxCharacterCountProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const TextFieldMaxCharacterCount = withContext<
  HTMLSpanElement,
  TextFieldMaxCharacterCountProps
>(withStateProps(Primitive.span), "maxCharacterCount");

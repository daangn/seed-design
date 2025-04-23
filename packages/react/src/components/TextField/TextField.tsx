import { composeRefs } from "@radix-ui/react-compose-refs";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { field, type FieldVariantProps } from "@seed-design/css/recipes/field";
import { textInput } from "@seed-design/css/recipes/text-input";
import { TextField, useTextFieldContext } from "@seed-design/react-field";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withContext, useClassNames, ClassNamesProvider } = createSlotRecipeContext(field);
const {
  withProvider: withTextInputProvider,
  withContext: withTextInputContext,
  useClassNames: useTextInputClassNames,
  PropsProvider: TextInputPropsProvider,
} = createSlotRecipeContext(textInput);
const withStateProps = createWithStateProps([useTextFieldContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldRootProps extends FieldVariantProps, TextField.RootProps {}

export const TextFieldRoot = forwardRef<HTMLDivElement, TextFieldRootProps>(
  ({ className, size, ...otherProps }, ref) => {
    const classNames = field({ size });
    return (
      <TextInputPropsProvider value={useMemo(() => ({ size }), [size])}>
        <ClassNamesProvider value={classNames}>
          <TextField.Root ref={ref} className={clsx(classNames.root, className)} {...otherProps} />
        </ClassNamesProvider>
      </TextInputPropsProvider>
    );
  },
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

export interface TextFieldBodyProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const TextFieldBody = withTextInputProvider<HTMLDivElement, TextFieldBodyProps>(
  withStateProps(Primitive.div),
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextFieldInputProps extends TextField.InputProps {}

export const TextFieldInput = withTextInputContext<HTMLInputElement, TextFieldInputProps>(
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
    const classNames = useTextInputClassNames();
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

////////////////////////////////////////////////////////////////////////////////////

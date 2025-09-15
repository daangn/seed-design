import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { FieldButton, useFieldButtonContext } from "@seed-design/react-field-button";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { field, type FieldVariantProps } from "@seed-design/css/recipes/field";
import { InternalIcon, type InternalIconProps } from "../private/Icon";
import { fieldButton } from "@seed-design/css/recipes/field-button";
import clsx from "clsx";

const { withContext: withFieldContext, withProvider: withFieldProvider } =
  createSlotRecipeContext(field);
const { withProvider, withContext, useClassNames } = createSlotRecipeContext(fieldButton);

const withStateProps = createWithStateProps([useFieldButtonContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonFieldRootProps extends FieldVariantProps, FieldButton.RootProps {}

export const FieldButtonFieldRoot = withFieldProvider<HTMLDivElement, FieldButtonFieldRootProps>(
  FieldButton.Root,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonHeader = withFieldContext<HTMLDivElement, FieldButtonHeaderProps>(
  withStateProps(Primitive.div),
  "header",
);

export interface FieldButtonLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonLabel = withFieldContext<HTMLDivElement, FieldButtonLabelProps>(
  withStateProps(Primitive.div),
  "label",
);

export interface FieldButtonIndicatorProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldButtonIndicator = withFieldContext<HTMLSpanElement, FieldButtonIndicatorProps>(
  withStateProps(Primitive.span),
  "indicator",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonPrefixIconProps extends InternalIconProps {}

export const FieldButtonPrefixIcon = withContext<SVGSVGElement, FieldButtonPrefixIconProps>(
  withStateProps(InternalIcon),
  "prefixIcon",
);

export interface FieldButtonPrefixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldButtonPrefixText = React.forwardRef<HTMLSpanElement, FieldButtonPrefixTextProps>(
  ({ className, ...props }, ref) => {
    const { stateProps } = useFieldButtonContext();
    const { prefixText } = useClassNames();

    return (
      <Primitive.span
        className={clsx(prefixText, className)}
        ref={ref}
        aria-hidden
        {...stateProps}
        {...props}
      />
    );
  },
);

export interface FieldButtonSuffixIconProps extends InternalIconProps {}

export const FieldButtonSuffixIcon = withContext<SVGSVGElement, FieldButtonSuffixIconProps>(
  withStateProps(InternalIcon),
  "suffixIcon",
);

export interface FieldButtonSuffixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldButtonSuffixText = React.forwardRef<HTMLSpanElement, FieldButtonSuffixTextProps>(
  ({ className, ...props }, ref) => {
    const { stateProps } = useFieldButtonContext();
    const { suffixText } = useClassNames();

    return (
      <Primitive.span
        className={clsx(suffixText, className)}
        ref={ref}
        aria-hidden
        {...stateProps}
        {...props}
      />
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonFooter = withFieldContext<HTMLDivElement, FieldButtonFooterProps>(
  withStateProps(Primitive.div),
  "footer",
);

export interface FieldButtonDescriptionProps extends FieldButton.DescriptionProps {}

export const FieldButtonDescription = withFieldContext<
  HTMLSpanElement,
  FieldButtonDescriptionProps
>(FieldButton.Description, "description");

export interface FieldButtonErrorContainerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonErrorContainer = withFieldContext<
  HTMLDivElement,
  FieldButtonErrorContainerProps
>(withStateProps(Primitive.div), "errorContainer");

export interface FieldButtonErrorMessageProps extends FieldButton.ErrorMessageProps {}

export const FieldButtonErrorMessage = withFieldContext<
  HTMLSpanElement,
  FieldButtonErrorMessageProps
>(FieldButton.ErrorMessage, "errorMessage");

export interface FieldButtonErrorIconProps extends InternalIconProps {}

export const FieldButtonErrorIcon = withFieldContext<SVGSVGElement, FieldButtonErrorIconProps>(
  withStateProps(InternalIcon),
  "errorIcon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonHiddenInputsProps extends FieldButton.HiddenInputsProps {}

export const FieldButtonHiddenInputs = FieldButton.HiddenInputs;

export interface FieldButtonButtonProps extends FieldButton.ButtonProps {}

export const FieldButtonButton = withContext<HTMLButtonElement, FieldButtonButtonProps>(
  FieldButton.Button,
  "button",
);

export interface FieldButtonRootProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonRoot = withProvider<HTMLDivElement, FieldButtonRootProps>(
  withStateProps(Primitive.div),
  "root",
);

export interface FieldButtonClearButtonProps extends FieldButton.ClearButtonProps {}

export const FieldButtonClearButton = withContext<HTMLButtonElement, FieldButtonClearButtonProps>(
  FieldButton.ClearButton,
  "clearButton",
);

export interface FieldButtonValueProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonValue = React.forwardRef<HTMLDivElement, FieldButtonValueProps>(
  ({ className, ...props }, ref) => {
    const { stateProps } = useFieldButtonContext();
    const { value } = useClassNames();

    return (
      <Primitive.div
        className={clsx(value, className)}
        ref={ref}
        aria-hidden
        {...stateProps}
        {...props}
      />
    );
  },
);

export interface FieldButtonPlaceholderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonPlaceholder = React.forwardRef<HTMLDivElement, FieldButtonPlaceholderProps>(
  ({ className, ...props }, ref) => {
    const { stateProps } = useFieldButtonContext();
    const { placeholder } = useClassNames();

    return (
      <Primitive.div
        className={clsx(placeholder, className)}
        ref={ref}
        aria-hidden
        {...stateProps}
        {...props}
      />
    );
  },
);

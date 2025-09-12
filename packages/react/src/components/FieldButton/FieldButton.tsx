import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { FieldButton, useFieldButtonContext } from "@seed-design/react-field-button";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { field, type FieldVariantProps } from "@seed-design/css/recipes/field";
import { InternalIcon, type InternalIconProps } from "../private/Icon";
import { fieldButton } from "@seed-design/css/recipes/field-button";

const { withContext: withFieldContext, withProvider: withFieldProvider } =
  createSlotRecipeContext(field);
const { withProvider, withContext } = createSlotRecipeContext(fieldButton);

const withStateProps = createWithStateProps([useFieldButtonContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonRootProps extends FieldVariantProps, FieldButton.RootProps {}

export const FieldButtonRoot = withFieldProvider<HTMLDivElement, FieldButtonRootProps>(
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

export const FieldButtonPrefixText = withContext<HTMLSpanElement, FieldButtonPrefixTextProps>(
  withStateProps(Primitive.span),
  "prefixText",
);

export interface FieldButtonSuffixIconProps extends InternalIconProps {}

export const FieldButtonSuffixIcon = withContext<SVGSVGElement, FieldButtonSuffixIconProps>(
  withStateProps(InternalIcon),
  "suffixIcon",
);

export interface FieldButtonSuffixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldButtonSuffixText = withContext<HTMLSpanElement, FieldButtonSuffixTextProps>(
  withStateProps(Primitive.span),
  "suffixText",
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

export interface FieldButtonPositionerProps extends React.PropsWithChildren {}

export const FieldButtonPositioner = withProvider<HTMLDivElement, FieldButtonPositionerProps>(
  withStateProps(Primitive.div),
  "positioner",
);

export interface FieldButtonHiddenInputsProps extends FieldButton.HiddenInputsProps {}

export const FieldButtonHiddenInputs = FieldButton.HiddenInputs;

export interface FieldButtonButtonProps extends FieldButton.ButtonProps {}

export const FieldButtonButton = withContext<HTMLButtonElement, FieldButtonButtonProps>(
  FieldButton.Button,
  "button",
);

export interface FieldButtonVisualProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonVisual = withContext<HTMLDivElement, FieldButtonVisualProps>(
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

export const FieldButtonValue = withContext<HTMLDivElement, FieldButtonValueProps>(
  withStateProps(Primitive.div),
  "value",
);

export interface FieldButtonPlaceholderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonPlaceholder = withContext<HTMLDivElement, FieldButtonPlaceholderProps>(
  withStateProps(Primitive.div),
  "placeholder",
);

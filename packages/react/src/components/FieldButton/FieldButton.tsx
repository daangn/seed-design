import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { FieldButton, useFieldButtonContext } from "@seed-design/react-field-button";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { field, type FieldVariantProps } from "@seed-design/css/recipes/field";
import { InternalIcon, type InternalIconProps } from "../private/Icon";
import { fieldButton } from "@seed-design/css/recipes/field-button";

const { withProvider: withFieldProvider, withContext: withFieldContext } =
  createSlotRecipeContext(field);
const { withProvider, withContext } = createSlotRecipeContext(fieldButton);

const withFieldButtonStateProps = createWithStateProps([useFieldButtonContext]);
const withFieldStateProps = createWithStateProps([
  { useContext: useFieldButtonContext, strict: false },
]);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonRootProps extends FieldVariantProps, FieldButton.RootProps {}

export const FieldButtonRoot = withFieldStateProps(
  withFieldProvider<HTMLDivElement, FieldButtonRootProps>(FieldButton.Root, "root"),
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonHeader = withFieldContext<HTMLDivElement, FieldButtonHeaderProps>(
  withFieldStateProps(withFieldButtonStateProps(Primitive.div)),
  "header",
);

export interface FieldButtonLabelProps extends FieldButton.LabelProps {}

export const FieldButtonLabel = withFieldContext<HTMLDivElement, FieldButtonLabelProps>(
  withFieldStateProps(FieldButton.Label),
  "label",
);

export interface FieldButtonIndicatorProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldButtonIndicator = withFieldContext<HTMLSpanElement, FieldButtonIndicatorProps>(
  withFieldStateProps(withFieldButtonStateProps(Primitive.span)),
  "indicator",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonPrefixIconProps extends InternalIconProps {}

export const FieldButtonPrefixIcon = withContext<SVGSVGElement, FieldButtonPrefixIconProps>(
  withFieldStateProps(withFieldButtonStateProps(InternalIcon)),
  "prefixIcon",
);

export interface FieldButtonPrefixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldButtonPrefixText = withContext<HTMLSpanElement, FieldButtonPrefixTextProps>(
  withFieldStateProps(withFieldButtonStateProps(Primitive.span)),
  "prefixText",
);

export interface FieldButtonSuffixIconProps extends InternalIconProps {}

export const FieldButtonSuffixIcon = withContext<SVGSVGElement, FieldButtonSuffixIconProps>(
  withFieldStateProps(withFieldButtonStateProps(InternalIcon)),
  "suffixIcon",
);

export interface FieldButtonSuffixTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldButtonSuffixText = withContext<HTMLSpanElement, FieldButtonSuffixTextProps>(
  withFieldStateProps(withFieldButtonStateProps(Primitive.span)),
  "suffixText",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonFooter = withFieldContext<HTMLDivElement, FieldButtonFooterProps>(
  withFieldStateProps(withFieldButtonStateProps(Primitive.div)),
  "footer",
);

export interface FieldButtonDescriptionProps extends FieldButton.DescriptionProps {}

export const FieldButtonDescription = withFieldContext<
  HTMLSpanElement,
  FieldButtonDescriptionProps
>(withFieldStateProps(FieldButton.Description), "description");

export interface FieldButtonErrorContainerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonErrorContainer = withFieldContext<
  HTMLDivElement,
  FieldButtonErrorContainerProps
>(withFieldStateProps(Primitive.div), "errorContainer");

export interface FieldButtonErrorMessageProps extends FieldButton.ErrorMessageProps {}

export const FieldButtonErrorMessage = withFieldContext<
  HTMLSpanElement,
  FieldButtonErrorMessageProps
>(withFieldStateProps(FieldButton.ErrorMessage), "errorMessage");

export interface FieldButtonErrorIconProps extends InternalIconProps {}

// TODO: 필요없는 경우, withStateProps는 빼는 게 좋을 것 같음

export const FieldButtonErrorIcon = withFieldContext<SVGSVGElement, FieldButtonErrorIconProps>(
  withFieldStateProps(withFieldButtonStateProps(InternalIcon)),
  "errorIcon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonFoobarProps extends React.PropsWithChildren {}

export const FieldButtonFoobar = withProvider<HTMLDivElement, FieldButtonFoobarProps>(
  withFieldStateProps(withFieldButtonStateProps(Primitive.div)),
  "root",
);

export interface FieldButtonHiddenInputsProps extends FieldButton.HiddenInputsProps {}

export const FieldButtonHiddenInputs = withFieldStateProps(
  withFieldButtonStateProps(FieldButton.HiddenInputs),
);

export interface FieldButtonButtonProps extends FieldButton.ButtonProps {}

export const FieldButtonButton = withContext<HTMLButtonElement, FieldButtonButtonProps>(
  withFieldStateProps(withFieldButtonStateProps(FieldButton.Button)),
  "button",
);

export interface FieldButtonClearButtonProps extends FieldButton.ClearButtonProps {}

export const FieldButtonClearButton = withContext<HTMLButtonElement, FieldButtonClearButtonProps>(
  withFieldStateProps(withFieldButtonStateProps(FieldButton.ClearButton)),
);

export interface FieldButtonValueProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonValue = withContext<HTMLDivElement, FieldButtonValueProps>(
  withFieldStateProps(withFieldButtonStateProps(Primitive.div)),
  "value",
);

export interface FieldButtonPlaceholderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonPlaceholder = withContext<HTMLDivElement, FieldButtonPlaceholderProps>(
  withFieldStateProps(withFieldButtonStateProps(Primitive.div)),
  "placeholder",
);

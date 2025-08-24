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

export interface FieldButtonLabelProps extends FieldButton.LabelProps {}

export const FieldButtonLabel = withFieldContext<HTMLDivElement, FieldButtonLabelProps>(
  withStateProps(FieldButton.Label),
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

export interface FieldButtonErrorMessageProps extends FieldButton.ErrorMessageProps {}

export const FieldButtonErrorMessage = withFieldContext<
  HTMLSpanElement,
  FieldButtonErrorMessageProps
>(FieldButton.ErrorMessage, "errorMessage");

export interface FieldButtonErrorIconProps extends InternalIconProps {}

// TODO: 필요없는 경우, withStateProps는 빼는 게 좋을 것 같음

export const FieldButtonErrorIcon = withFieldContext<SVGSVGElement, FieldButtonErrorIconProps>(
  withStateProps(InternalIcon),
  "errorIcon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonFoobarProps extends React.PropsWithChildren {}

export const FieldButtonFoobar = withProvider<HTMLDivElement, FieldButtonFoobarProps>(
  withStateProps(Primitive.div),
  "root",
);

export interface FieldButtonHiddenInputsProps extends FieldButton.HiddenInputsProps {}

export const FieldButtonHiddenInputs = withStateProps(FieldButton.HiddenInputs);

export interface FieldButtonButtonProps extends FieldButton.ButtonProps {}

export const FieldButtonButton = withContext<HTMLButtonElement, FieldButtonButtonProps>(
  withStateProps(FieldButton.Button),
);

export interface FieldButtonClearButtonProps extends FieldButton.ClearButtonProps {}

export const FieldButtonClearButton = withContext<HTMLButtonElement, FieldButtonClearButtonProps>(
  withStateProps(FieldButton.ClearButton),
);

import { field, type FieldVariantProps } from "@seed-design/css/recipes/field";
import { Field, useFieldContext } from "@seed-design/react-field";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(field);
const withStateProps = createWithStateProps([useFieldContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldRootProps extends FieldVariantProps, Field.RootProps {}

export const FieldRoot = withProvider<HTMLDivElement, FieldRootProps>(Field.Root, "root");

////////////////////////////////////////////////////////////////////////////////////

export interface FieldHeaderProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const FieldHeader = withContext<HTMLDivElement, FieldHeaderProps>(
  withStateProps(Primitive.div),
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldLabelProps extends Field.LabelProps {}

export const FieldLabel = withContext<HTMLLabelElement, FieldLabelProps>(Field.Label, "label");

////////////////////////////////////////////////////////////////////////////////////

export interface FieldIndicatorProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldIndicator = forwardRef<HTMLSpanElement, FieldIndicatorProps>((props, ref) => {
  const { className, ...otherProps } = props;
  const classNames = useClassNames();

  return (
    <>
      <Primitive.span> </Primitive.span>
      <Primitive.span ref={ref} className={clsx(classNames.indicator, className)} {...otherProps} />
    </>
  );
});

////////////////////////////////////////////////////////////////////////////////////

export interface FieldFooterProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const FieldFooter = withContext<HTMLDivElement, FieldFooterProps>(
  withStateProps(Primitive.div),
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldDescriptionProps extends Field.DescriptionProps {}

export const FieldDescription = withContext<HTMLSpanElement, FieldDescriptionProps>(
  Field.Description,
  "description",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldErrorMessageProps extends Field.ErrorMessageProps {}

export const FieldErrorMessage = withContext<HTMLSpanElement, FieldErrorMessageProps>(
  Field.ErrorMessage,
  "errorMessage",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldCharacterCountAreaProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldCharacterCountArea = withContext<HTMLDivElement, FieldCharacterCountAreaProps>(
  withStateProps(Primitive.div),
  "characterCountArea",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldCharacterCountProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldCharacterCount = withContext<HTMLSpanElement, FieldCharacterCountProps>(
  withStateProps(Primitive.span),
  "characterCount",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldMaxCharacterCountProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldMaxCharacterCount = withContext<HTMLSpanElement, FieldMaxCharacterCountProps>(
  withStateProps(Primitive.span),
  "maxCharacterCount",
);

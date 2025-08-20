import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { Field, useFieldContext } from "@seed-design/react-field";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { field, type FieldVariantProps } from "@seed-design/css/recipes/field";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

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

export const FieldLabel = withContext<HTMLLabelElement, FieldLabelProps>(
  withStateProps(Field.Label),
  "label",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldIndicatorProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FieldIndicator = withContext<HTMLSpanElement, FieldIndicatorProps>(
  withStateProps(Primitive.span),
  "indicator",
);

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

export interface FieldErrorIconProps extends InternalIconProps {}

// TODO: 필요없는 경우, withStateProps는 빼는 게 좋을 것 같음

export const FieldErrorIcon = withContext<SVGSVGElement, FieldErrorIconProps>(
  withStateProps(InternalIcon),
  "errorIcon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FieldCharacterCountProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {
  /**
   * The current number of characters/graphemes
   */
  current: number;
  /**
   * The maximum allowed characters/graphemes
   */
  max: number;
}

export const FieldCharacterCount = forwardRef<HTMLDivElement, FieldCharacterCountProps>(
  ({ current, max, className, ...otherProps }, ref) => {
    const classNames = useClassNames();

    return (
      <Primitive.div
        ref={ref}
        className={clsx(classNames.characterCountArea, className)}
        {...otherProps}
      >
        <span
          {...(current === 0 ? { "data-empty": true } : {})}
          {...(current > max ? { "data-exceeded": true } : {})}
          className={clsx(classNames.characterCount)}
        >
          {current}
        </span>
        <span className={clsx(classNames.maxCharacterCount)}>/{max}</span>
      </Primitive.div>
    );
  },
);

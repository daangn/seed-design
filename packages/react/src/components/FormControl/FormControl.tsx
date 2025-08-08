import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { FormControl, useFormControlContext } from "@seed-design/react-form-control";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { formControl, type FormControlVariantProps } from "@seed-design/css/recipes/form-control";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(formControl);
const withStateProps = createWithStateProps([useFormControlContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface FormControlRootProps extends FormControlVariantProps, FormControl.RootProps {}

export const FormControlRoot = withProvider<HTMLDivElement, FormControlRootProps>(
  FormControl.Root,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FormControlHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FormControlHeader = withContext<HTMLDivElement, FormControlHeaderProps>(
  withStateProps(Primitive.div),
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FormControlLabelProps extends FormControl.LabelProps {}

export const FormControlLabel = withContext<HTMLLabelElement, FormControlLabelProps>(
  withStateProps(FormControl.Label),
  "label",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FormControlIndicatorProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FormControlIndicator = forwardRef<HTMLSpanElement, FormControlIndicatorProps>(
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
export interface FormControlFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FormControlFooter = withContext<HTMLDivElement, FormControlFooterProps>(
  withStateProps(Primitive.div),
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FormControlDescriptionProps extends FormControl.DescriptionProps {}

export const FormControlDescription = withContext<HTMLSpanElement, FormControlDescriptionProps>(
  FormControl.Description,
  "description",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FormControlErrorMessageProps extends FormControl.ErrorMessageProps {}

export const FormControlErrorMessage = withContext<HTMLSpanElement, FormControlErrorMessageProps>(
  FormControl.ErrorMessage,
  "errorMessage",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FormControlErrorIconProps extends InternalIconProps {}

// TODO: 필요없는 경우, withStateProps는 빼는 게 좋을 것 같음

export const FormControlErrorIcon = withContext<SVGSVGElement, FormControlErrorIconProps>(
  withStateProps(InternalIcon),
  "errorIcon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FormControlCharacterCountProps
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

export const FormControlCharacterCount = forwardRef<HTMLDivElement, FormControlCharacterCountProps>(
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

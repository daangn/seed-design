import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { FieldButton, useFieldButtonContext } from "@seed-design/react-field-button";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { field, type FieldVariantProps } from "@seed-design/css/recipes/field";
import { fieldLabel, type FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";
import { InternalIcon, type InternalIconProps } from "../private/Icon";
import { inputButton } from "@seed-design/css/recipes/input-button";
import clsx from "clsx";
import { createRecipeContext } from "../../utils/createRecipeContext";

const {
  withContext: withFieldContext,
  withProvider: withFieldProvider,
  useClassNames: useFieldClassNames,
} = createSlotRecipeContext(field);
const { withProvider, withContext, useClassNames } = createSlotRecipeContext(inputButton);
const { withContext: withLabelContext } = createRecipeContext(fieldLabel);

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
    FieldLabelVariantProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonLabel = withLabelContext<HTMLDivElement, FieldButtonLabelProps>(
  withStateProps(Primitive.div),
);

export interface FieldButtonIndicatorTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonIndicatorText = withFieldContext<
  HTMLDivElement,
  FieldButtonIndicatorTextProps
>(withStateProps(Primitive.div), "indicatorText");

export interface FieldButtonRequiredIndicatorProps extends React.SVGProps<SVGElement> {}

export const FieldButtonRequiredIndicator = React.forwardRef<
  SVGSVGElement,
  FieldButtonRequiredIndicatorProps
>(({ className, ...props }, ref) => {
  const { indicatorIcon } = useFieldClassNames();

  return (
    <InternalIcon
      svg={
        // biome-ignore lint/a11y/noSvgWithoutTitle: InternalIcon is aria-hidden
        <svg
          viewBox="0 0 6 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={clsx(indicatorIcon, className)}
        >
          <path
            d="M3.75002 1.55859L4.41318 1.09468C4.75243 0.857361 5.21982 0.939865 5.45732 1.27899C5.69499 1.61836 5.61243 2.08615 5.27295 2.32366L4.30763 2.99902L5.27372 3.67612C5.61285 3.91381 5.69517 4.38137 5.45761 4.72059C5.21999 5.0599 4.7523 5.14233 4.41299 4.90471L3.75002 4.44043V5.25C3.75002 5.66421 3.41423 6 3.00002 6C2.5858 6 2.25002 5.66421 2.25002 5.25V4.44043L1.58704 4.90471C1.24773 5.14233 0.780041 5.0599 0.542418 4.72059C0.304856 4.38137 0.387176 3.91381 0.726309 3.67612L1.6924 2.99902L0.727079 2.32366C0.387603 2.08615 0.305043 1.61836 0.542707 1.27899C0.780206 0.939865 1.2476 0.857361 1.58685 1.09468L2.25002 1.55859V0.75C2.25002 0.335786 2.5858 0 3.00002 0C3.41423 0 3.75002 0.335786 3.75002 0.75V1.55859Z"
            fill="currentColor"
          />
        </svg>
      }
      ref={ref}
      {...props}
    />
  );
});
FieldButtonRequiredIndicator.displayName = "FieldButtonRequiredIndicator";

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
FieldButtonPrefixText.displayName = "FieldButtonPrefixText";

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
FieldButtonSuffixText.displayName = "FieldButtonSuffixText";

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

////////////////////////////////////////////////////////////////////////////////////

export interface FieldButtonHiddenInputProps extends FieldButton.HiddenInputProps {}

export const FieldButtonHiddenInput = FieldButton.HiddenInput;

export interface FieldButtonButtonProps extends FieldButton.ButtonProps {}

export const FieldButtonButton = withContext<HTMLButtonElement, FieldButtonButtonProps>(
  FieldButton.Button,
  "button",
);

export interface FieldButtonControlProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FieldButtonControl = withProvider<HTMLDivElement, FieldButtonControlProps>(
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
FieldButtonValue.displayName = "FieldButtonValue";

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
FieldButtonPlaceholder.displayName = "FieldButtonPlaceholder";

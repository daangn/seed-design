"use client";

import { field, type FieldVariantProps } from "@ride-developer/css/recipes/field";
import { fieldLabel, type FieldLabelVariantProps } from "@ride-developer/css/recipes/field-label";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { RadioGroup as RadioGroupPrimitive } from "@seed-design/react-radio-group";
import type * as React from "react";
import { forwardRef } from "react";
import clsx from "clsx";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { InternalIcon } from "../private/Icon";

const { withProvider, withContext } = createSlotRecipeContext(field);
const {
  withContext: withLabelContext,
  withProvider: withLabelProvider,
  useClassNames: useLabelClassNames,
} = createSlotRecipeContext(fieldLabel);

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupFieldRootProps
  extends FieldVariantProps,
    RadioGroupPrimitive.RootProps {}

export const RadioGroupFieldRoot = withProvider<HTMLDivElement, RadioGroupFieldRootProps>(
  RadioGroupPrimitive.Root,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupFieldHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioGroupFieldHeader = withContext<HTMLDivElement, RadioGroupFieldHeaderProps>(
  Primitive.div,
  "header",
);

export interface RadioGroupFieldLabelProps
  extends FieldLabelVariantProps,
    RadioGroupPrimitive.LabelProps {}

export const RadioGroupFieldLabel = withLabelProvider<HTMLDivElement, RadioGroupFieldLabelProps>(
  RadioGroupPrimitive.Label,
  "root",
);

export interface RadioGroupFieldIndicatorTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const RadioGroupFieldIndicatorText = withLabelContext<
  HTMLSpanElement,
  RadioGroupFieldIndicatorTextProps
>(Primitive.span, "indicatorText");

export interface RadioGroupFieldRequiredIndicatorProps extends React.SVGProps<SVGElement> {}

export const RadioGroupFieldRequiredIndicator = forwardRef<
  SVGSVGElement,
  RadioGroupFieldRequiredIndicatorProps
>(({ className, ...props }, ref) => {
  const { indicatorIcon } = useLabelClassNames();

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
RadioGroupFieldRequiredIndicator.displayName = "RadioGroupFieldRequiredIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioGroupFieldFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioGroupFieldFooter = withContext<HTMLDivElement, RadioGroupFieldFooterProps>(
  Primitive.div,
  "footer",
);

export interface RadioGroupFieldDescriptionProps extends RadioGroupPrimitive.DescriptionProps {}

export const RadioGroupFieldDescription = withContext<
  HTMLSpanElement,
  RadioGroupFieldDescriptionProps
>(RadioGroupPrimitive.Description, "description");

export interface RadioGroupFieldErrorMessageProps extends RadioGroupPrimitive.ErrorMessageProps {}

export const RadioGroupFieldErrorMessage = withContext<
  HTMLDivElement,
  RadioGroupFieldErrorMessageProps
>(RadioGroupPrimitive.ErrorMessage, "errorMessage");

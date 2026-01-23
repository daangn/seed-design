import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import {
  RadioGroup as SeedRadioGroup,
  RadioGroupField as SeedRadioGroupField,
  PrefixIcon,
  VisuallyHidden,
} from "@seed-design/react";
import type { FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";
import { radioGroup, type RadioGroupVariantProps } from "@seed-design/css/recipes/radio-group";
import * as React from "react";

export interface RadioGroupProps extends SeedRadioGroupField.RootProps, RadioGroupVariantProps {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: FieldLabelVariantProps["weight"];
  indicator?: React.ReactNode;
  showRequiredIndicator?: boolean;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/radio-group
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      showRequiredIndicator,

      description,
      errorMessage,

      children,

      ...props
    },
    ref,
  ) => {
    const [variantProps, restProps] = radioGroup.splitVariantProps(props);

    if (
      process.env.NODE_ENV !== "production" &&
      !label &&
      !restProps["aria-label"] &&
      !restProps["aria-labelledby"]
    ) {
      console.warn(
        "RadioGroup: Provide a `label` prop for better accessibility. Please ignore this warning if you've provided `aria-label` or `aria-labelledby` props. This warning will not be shown in production builds.",
      );
    }

    const renderErrorMessage = errorMessage && restProps.invalid;
    const renderFooter = description || renderErrorMessage;

    return (
      <SeedRadioGroupField.Root ref={ref} {...restProps}>
        {(label || indicator) && (
          <SeedRadioGroupField.Header>
            <SeedRadioGroupField.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator && <SeedRadioGroupField.RequiredIndicator />}
              {indicator && (
                <SeedRadioGroupField.IndicatorText>{indicator}</SeedRadioGroupField.IndicatorText>
              )}
            </SeedRadioGroupField.Label>
          </SeedRadioGroupField.Header>
        )}
        <SeedRadioGroup.Root {...variantProps}>{children}</SeedRadioGroup.Root>
        {renderFooter && (
          <SeedRadioGroupField.Footer>
            {description &&
              (renderErrorMessage ? (
                <VisuallyHidden asChild>
                  <SeedRadioGroupField.Description>{description}</SeedRadioGroupField.Description>
                </VisuallyHidden>
              ) : (
                <SeedRadioGroupField.Description>{description}</SeedRadioGroupField.Description>
              ))}
            {renderErrorMessage && (
              <SeedRadioGroupField.ErrorMessage>
                <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
                {errorMessage}
              </SeedRadioGroupField.ErrorMessage>
            )}
          </SeedRadioGroupField.Footer>
        )}
      </SeedRadioGroupField.Root>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps extends SeedRadioGroup.ItemProps {
  label?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/radio-group
 */
export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ label, inputProps, rootRef, ...otherProps }, ref) => {
    return (
      <SeedRadioGroup.Item ref={rootRef} {...otherProps}>
        <SeedRadioGroup.ItemControl>
          <SeedRadioGroup.ItemIndicator
            checked={
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="currentColor" />
              </svg>
            }
          />
        </SeedRadioGroup.ItemControl>
        {label && <SeedRadioGroup.ItemLabel>{label}</SeedRadioGroup.ItemLabel>}
        <SeedRadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
      </SeedRadioGroup.Item>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export interface RadiomarkProps extends SeedRadioGroup.ItemControlProps {}

/**
 * @see https://seed-design.io/react/components/radio-group
 */
export const Radiomark = React.forwardRef<HTMLDivElement, RadiomarkProps>((props, ref) => {
  return (
    <SeedRadioGroup.ItemControl ref={ref} {...props}>
      <SeedRadioGroup.ItemIndicator
        checked={
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
          </svg>
        }
      />
    </SeedRadioGroup.ItemControl>
  );
});
Radiomark.displayName = "Radiomark";

/**
 * @deprecated Use `Radiomark` instead. Will be removed in @seed-design/react@1.3.0.
 */
export const RadioMark = Radiomark;

/**
 * @deprecated Use `RadiomarkProps` instead. Will be removed in @seed-design/react@1.3.0.
 */
export type RadioMarkProps = RadiomarkProps;

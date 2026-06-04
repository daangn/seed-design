"use client";

import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFatFill from "@karrotmarket/react-monochrome-icon/IconMinusFatFill";
import IconExclamationmarkCircleFill from "@karrotmarket/react-monochrome-icon/IconExclamationmarkCircleFill";
import {
  Checkbox as SeedCheckbox,
  Fieldset as SeedFieldset,
  PrefixIcon,
  VisuallyHidden,
} from "@seed-design/react";
import type { FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";
import * as React from "react";
import {
  checkboxGroup,
  type CheckboxGroupVariantProps,
} from "@seed-design/css/recipes/checkbox-group";

export interface CheckboxGroupProps extends SeedFieldset.RootProps, CheckboxGroupVariantProps {
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
 * @see https://seed-design.io/react/components/checkbox
 */
export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
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
    const [variantProps, restProps] = checkboxGroup.splitVariantProps(props);

    if (
      process.env.NODE_ENV !== "production" &&
      !label &&
      !restProps["aria-label"] &&
      !restProps["aria-labelledby"]
    ) {
      console.warn(
        "CheckboxGroup component is recommended to have a `label`, `aria-label` or `aria-labelledby` attribute.",
      );
    }

    return (
      <SeedFieldset.Root ref={ref} {...restProps}>
        {(label || indicator) && (
          <SeedFieldset.Header>
            <SeedFieldset.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator && <SeedFieldset.RequiredIndicator />}
              {indicator && <SeedFieldset.IndicatorText>{indicator}</SeedFieldset.IndicatorText>}
            </SeedFieldset.Label>
          </SeedFieldset.Header>
        )}
        <SeedCheckbox.Group {...variantProps}>{children}</SeedCheckbox.Group>
        {(description || errorMessage) && (
          <SeedFieldset.Footer>
            {description &&
              (errorMessage ? (
                <VisuallyHidden asChild>
                  <SeedFieldset.Description>{description}</SeedFieldset.Description>
                </VisuallyHidden>
              ) : (
                <SeedFieldset.Description>{description}</SeedFieldset.Description>
              ))}
            {errorMessage && (
              <SeedFieldset.ErrorMessage>
                <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
                {errorMessage}
              </SeedFieldset.ErrorMessage>
            )}
          </SeedFieldset.Footer>
        )}
      </SeedFieldset.Root>
    );
  },
);
CheckboxGroup.displayName = "CheckboxGroup";

export interface CheckboxProps extends SeedCheckbox.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;

  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/checkbox
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ inputProps, rootRef, label, ...otherProps }, ref) => {
    return (
      <SeedCheckbox.Root ref={rootRef} {...otherProps}>
        <SeedCheckbox.Control>
          <SeedCheckbox.Indicator
            unchecked={otherProps.variant === "ghost" ? <IconCheckmarkFatFill /> : null}
            checked={<IconCheckmarkFatFill />}
            indeterminate={<IconMinusFatFill />}
          />
        </SeedCheckbox.Control>
        <SeedCheckbox.Label>{label}</SeedCheckbox.Label>
        <SeedCheckbox.HiddenInput ref={ref} {...inputProps} />
      </SeedCheckbox.Root>
    );
  },
);
Checkbox.displayName = "Checkbox";

export interface CheckmarkProps extends SeedCheckbox.ControlProps {}

export const Checkmark = React.forwardRef<HTMLDivElement, CheckmarkProps>((props, ref) => {
  return (
    <SeedCheckbox.Control ref={ref} {...props}>
      <SeedCheckbox.Indicator
        unchecked={props.variant === "ghost" ? <IconCheckmarkFatFill /> : null}
        checked={<IconCheckmarkFatFill />}
        indeterminate={<IconMinusFatFill />}
      />
    </SeedCheckbox.Control>
  );
});
Checkmark.displayName = "Checkmark";

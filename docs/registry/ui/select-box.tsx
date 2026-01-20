"use client";

import {
  IconCheckmarkFatFill,
  IconExclamationmarkCircleFill,
} from "@karrotmarket/react-monochrome-icon";
import {
  RadioSelectBox as SeedRadioSelectBox,
  CheckSelectBox as SeedCheckSelectBox,
  RadioGroupField as SeedRadioGroupField,
  Fieldset as SeedFieldset,
  PrefixIcon,
  VisuallyHidden,
} from "@seed-design/react";
import { RadioMark, type RadioMarkProps } from "./radio-group";
import * as React from "react";
import type { FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";

export interface RadioSelectBoxRootProps extends SeedRadioGroupField.RootProps {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: FieldLabelVariantProps["weight"];
  indicator?: React.ReactNode;
  showRequiredIndicator?: boolean;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;

  /**
   * Number of columns in the grid layout.
   * @default 1
   */
  columns?: number;
}

/**
 * @see https://seed-design.io/react/components/select-box
 */
export const RadioSelectBoxRoot = React.forwardRef<HTMLDivElement, RadioSelectBoxRootProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      showRequiredIndicator,

      description,
      errorMessage,

      columns = 1,
      children,

      ...props
    },
    ref,
  ) => {
    if (!label && !props["aria-label"] && !props["aria-labelledby"]) {
      console.warn(
        "RadioSelectBoxRoot component requires a `label`, `aria-label` or `aria-labelledby` attribute.",
      );
    }

    const renderErrorMessage = errorMessage && props.invalid;
    const renderFooter = description || renderErrorMessage;

    return (
      <SeedRadioGroupField.Root ref={ref} {...props}>
        {(label || indicator) && (
          <SeedRadioGroupField.Header>
            <SeedRadioGroupField.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator && <SeedRadioGroupField.RequiredIndicator />}
              {indicator && (
                <SeedRadioGroupField.IndicatorText>{indicator}</SeedRadioGroupField.IndicatorText>
              )}
            </SeedRadioGroupField.Label>
            {/* You might want to put your custom element here */}
          </SeedRadioGroupField.Header>
        )}
        <SeedRadioSelectBox.Group columns={columns}>{children}</SeedRadioSelectBox.Group>
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
RadioSelectBoxRoot.displayName = "RadioSelectBoxRoot";

export interface RadioSelectBoxItemProps extends Omit<SeedRadioSelectBox.ItemProps, "children"> {
  label: React.ReactNode;
  description?: React.ReactNode;

  prefixIcon?: React.ReactNode;
  suffix?: React.ReactNode;
  footer?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
}

export const RadioSelectBoxItem = React.forwardRef<HTMLInputElement, RadioSelectBoxItemProps>(
  ({ label, description, prefixIcon, suffix, inputProps, rootRef, footer, ...otherProps }, ref) => {
    return (
      <SeedRadioSelectBox.Item ref={rootRef} {...otherProps}>
        <SeedRadioSelectBox.Trigger>
          <SeedRadioSelectBox.HiddenInput ref={ref} {...inputProps} />
          <SeedRadioSelectBox.Content>
            {prefixIcon && <PrefixIcon svg={prefixIcon} />}
            <SeedRadioSelectBox.Body>
              <SeedRadioSelectBox.Label>{label}</SeedRadioSelectBox.Label>
              {description && (
                <SeedRadioSelectBox.Description>{description}</SeedRadioSelectBox.Description>
              )}
            </SeedRadioSelectBox.Body>
          </SeedRadioSelectBox.Content>
          {suffix}
        </SeedRadioSelectBox.Trigger>
        {footer && <SeedRadioSelectBox.Footer>{footer}</SeedRadioSelectBox.Footer>}
      </SeedRadioSelectBox.Item>
    );
  },
);
RadioSelectBoxItem.displayName = "RadioSelectBoxItem";

export interface RadioSelectBoxRadioMarkProps extends RadioMarkProps {}

export const RadioSelectBoxRadioMark = React.forwardRef<
  HTMLDivElement,
  RadioSelectBoxRadioMarkProps
>((props, ref) => {
  return <RadioMark ref={ref} size="medium" tone="neutral" {...props} />;
});
RadioSelectBoxRadioMark.displayName = "RadioSelectBoxRadioMark";

export interface CheckSelectBoxGroupProps extends SeedFieldset.RootProps {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: FieldLabelVariantProps["weight"];
  indicator?: React.ReactNode;
  showRequiredIndicator?: boolean;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;

  /**
   * Number of columns in the grid layout.
   * @default 1
   */
  columns?: number;
}

export const CheckSelectBoxGroup = React.forwardRef<HTMLDivElement, CheckSelectBoxGroupProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      showRequiredIndicator,

      description,
      errorMessage,

      columns = 1,
      children,

      ...props
    },
    ref,
  ) => {
    if (!label && !props["aria-label"] && !props["aria-labelledby"]) {
      console.warn(
        "CheckSelectBoxGroup component is recommended to have a `label`, `aria-label` or `aria-labelledby` attribute.",
      );
    }

    return (
      <SeedFieldset.Root ref={ref} {...props}>
        {(label || indicator) && (
          <SeedFieldset.Header>
            <SeedFieldset.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator && <SeedFieldset.RequiredIndicator />}
              {indicator && <SeedFieldset.IndicatorText>{indicator}</SeedFieldset.IndicatorText>}
            </SeedFieldset.Label>
            {/* You might want to put your custom element here */}
          </SeedFieldset.Header>
        )}
        <SeedCheckSelectBox.Group columns={columns}>{children}</SeedCheckSelectBox.Group>
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

export interface CheckSelectBoxProps extends Omit<SeedCheckSelectBox.RootProps, "children"> {
  label: React.ReactNode;
  description?: React.ReactNode;

  prefixIcon?: React.ReactNode;
  suffix?: React.ReactNode;
  footer?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/select-box
 */
export const CheckSelectBox = React.forwardRef<HTMLInputElement, CheckSelectBoxProps>(
  ({ label, description, prefixIcon, suffix, inputProps, rootRef, footer, ...otherProps }, ref) => {
    return (
      <SeedCheckSelectBox.Root ref={rootRef} {...otherProps}>
        <SeedCheckSelectBox.Trigger>
          <SeedCheckSelectBox.HiddenInput ref={ref} {...inputProps} />
          <SeedCheckSelectBox.Content>
            {prefixIcon && <PrefixIcon svg={prefixIcon} />}
            <SeedCheckSelectBox.Body>
              <SeedCheckSelectBox.Label>{label}</SeedCheckSelectBox.Label>
              {description && (
                <SeedCheckSelectBox.Description>{description}</SeedCheckSelectBox.Description>
              )}
            </SeedCheckSelectBox.Body>
          </SeedCheckSelectBox.Content>
          {suffix}
        </SeedCheckSelectBox.Trigger>
        {footer && <SeedCheckSelectBox.Footer>{footer}</SeedCheckSelectBox.Footer>}
      </SeedCheckSelectBox.Root>
    );
  },
);
CheckSelectBox.displayName = "CheckSelectBox";

export interface CheckSelectBoxCheckmarkProps extends SeedCheckSelectBox.CheckmarkControlProps {}

export const CheckSelectBoxCheckmark = React.forwardRef<
  HTMLDivElement,
  CheckSelectBoxCheckmarkProps
>((props, ref) => {
  return (
    <SeedCheckSelectBox.CheckmarkControl ref={ref} {...props}>
      <SeedCheckSelectBox.CheckmarkIcon svg={<IconCheckmarkFatFill />} />
    </SeedCheckSelectBox.CheckmarkControl>
  );
});
CheckSelectBoxCheckmark.displayName = "CheckSelectBoxCheckmark";

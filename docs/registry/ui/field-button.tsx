"use client";

import * as React from "react";
import {
  FieldButton as SeedFieldButton,
  VisuallyHidden,
  Icon,
  PrefixIcon,
} from "@seed-design/react";
import {
  IconExclamationmarkCircleFill,
  IconXmarkCircleFill,
} from "@karrotmarket/react-monochrome-icon";

export interface FieldButtonProps extends Omit<SeedFieldButton.FieldRootProps, "prefix"> {
  label?: React.ReactNode;
  indicator?: React.ReactNode;

  prefixIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  suffix?: React.ReactNode;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;

  showRequiredIndicator?: boolean;
  showClearButton?: boolean;

  buttonProps?: SeedFieldButton.ButtonProps;

  rootRef?: React.Ref<HTMLDivElement>;
}

/**
 * @see https://seed-design.io/react/components/field-button
 */
export const FieldButton = React.forwardRef<HTMLButtonElement, FieldButtonProps>(
  (
    {
      label,
      indicator,

      prefix,
      prefixIcon,
      suffix,
      suffixIcon,

      description,
      errorMessage,

      showRequiredIndicator,
      showClearButton,

      buttonProps,

      rootRef,

      children,

      ...otherProps
    },
    ref,
  ) => {
    const renderHeader = label || indicator;
    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && otherProps.invalid;
    const renderFooter = renderDescription || renderErrorMessage;

    if (
      !buttonProps?.["aria-labelledby"] &&
      !buttonProps?.["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn("FieldButton: aria-labelledby or aria-label should be provided to buttonProps.");
    }

    if (!otherProps.onValuesChange && showClearButton) {
      console.warn(
        "FieldButton: FieldButton without onValuesChange works as a display component, but it needs onValuesChange to work correctly with a clear button.",
      );
    }

    return (
      <SeedFieldButton.FieldRoot ref={rootRef} {...otherProps}>
        {renderHeader && (
          <SeedFieldButton.Header>
            <SeedFieldButton.Label>
              {label}
              {showRequiredIndicator && <SeedFieldButton.RequiredIndicator />}
              {indicator && (
                <SeedFieldButton.IndicatorText>{indicator}</SeedFieldButton.IndicatorText>
              )}
            </SeedFieldButton.Label>
          </SeedFieldButton.Header>
        )}
        <SeedFieldButton.Root>
          <SeedFieldButton.Button ref={ref} {...buttonProps} />
          {prefixIcon && <SeedFieldButton.PrefixIcon svg={prefixIcon} />}
          {prefix && <SeedFieldButton.PrefixText>{prefix}</SeedFieldButton.PrefixText>}
          {children}
          {showClearButton && (
            // You may implement your own i18n for clear button label
            <SeedFieldButton.ClearButton aria-label="지우기">
              <Icon svg={<IconXmarkCircleFill />} />
            </SeedFieldButton.ClearButton>
          )}
          {suffix && <SeedFieldButton.SuffixText>{suffix}</SeedFieldButton.SuffixText>}
          {suffixIcon && <SeedFieldButton.SuffixIcon svg={suffixIcon} />}
        </SeedFieldButton.Root>
        {renderFooter && (
          <SeedFieldButton.Footer>
            {renderDescription &&
              (renderErrorMessage ? (
                <VisuallyHidden asChild>
                  <SeedFieldButton.Description>{description}</SeedFieldButton.Description>
                </VisuallyHidden>
              ) : (
                <SeedFieldButton.Description>{description}</SeedFieldButton.Description>
              ))}
            {renderErrorMessage && (
              <SeedFieldButton.ErrorMessage>
                <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
                {errorMessage}
              </SeedFieldButton.ErrorMessage>
            )}
          </SeedFieldButton.Footer>
        )}
        {otherProps.values?.map((_, index) => (
          <SeedFieldButton.HiddenInput key={index} valueIndex={index} />
        ))}
      </SeedFieldButton.FieldRoot>
    );
  },
);
FieldButton.displayName = "FieldButton";

export interface FieldButtonValueProps extends SeedFieldButton.ValueProps {}

/**
 * @see https://seed-design.io/react/components/field-button
 */
export const FieldButtonValue = SeedFieldButton.Value;

export interface FieldButtonPlaceholderProps extends SeedFieldButton.PlaceholderProps {}

/**
 * @see https://seed-design.io/react/components/field-button
 */
export const FieldButtonPlaceholder = SeedFieldButton.Placeholder;

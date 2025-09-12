"use client";

import * as React from "react";
import {
  FieldButton as SeedFieldButton,
  Presentational,
  VisuallyHidden,
  Icon,
} from "@seed-design/react";
import {
  IconExclamationmarkCircleFill,
  IconXmarkCircleFill,
} from "@karrotmarket/react-monochrome-icon";

export interface FieldButtonProps extends Omit<SeedFieldButton.RootProps, "prefix"> {
  label?: React.ReactNode;
  indicator?: React.ReactNode;

  prefixIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  suffix?: React.ReactNode;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  invalid?: boolean;

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
      invalid,

      buttonProps,

      rootRef,

      children,

      ...otherProps
    },
    ref,
  ) => {
    const renderHeader = label || indicator;
    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && invalid;
    const renderFooter = renderDescription || renderErrorMessage;

    if (
      !buttonProps?.["aria-labelledby"] &&
      !buttonProps?.["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn("FieldButton: aria-labelledby or aria-label should be provided to buttonProps.");
    }

    if (
      !otherProps.onValuesChange
      // TODO
      // && showClearButton
    ) {
      console.warn(
        "FieldButton: FieldButton works without onValuesChange as a display component but it needs onValuesChange to show the clear button.",
      );
    }

    return (
      <SeedFieldButton.Root ref={rootRef} {...otherProps}>
        {renderHeader && (
          <SeedFieldButton.Header>
            <SeedFieldButton.Label>
              {label}
              {indicator && <SeedFieldButton.Indicator>{indicator}</SeedFieldButton.Indicator>}
            </SeedFieldButton.Label>
          </SeedFieldButton.Header>
        )}
        <SeedFieldButton.Positioner>
          {/* You may implement your own i18n for clear button label */}
          <SeedFieldButton.ClearButton aria-label="지우기">
            <Icon svg={<IconXmarkCircleFill />} />
          </SeedFieldButton.ClearButton>
          <SeedFieldButton.Button type="button" ref={ref} {...buttonProps} />
          {/* TODO: clear button should be inside visual but not aria-hidden */}
          <Presentational asChild>
            <SeedFieldButton.Visual>
              {prefixIcon && <SeedFieldButton.PrefixIcon svg={prefixIcon} />}
              {prefix && <SeedFieldButton.PrefixText>{prefix}</SeedFieldButton.PrefixText>}
              {children}
              {suffix && <SeedFieldButton.SuffixText>{suffix}</SeedFieldButton.SuffixText>}
              {suffixIcon && <SeedFieldButton.SuffixIcon svg={suffixIcon} />}
            </SeedFieldButton.Visual>
          </Presentational>
        </SeedFieldButton.Positioner>
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
              <SeedFieldButton.ErrorContainer>
                <SeedFieldButton.ErrorIcon svg={<IconExclamationmarkCircleFill />} />
                <SeedFieldButton.ErrorMessage>{errorMessage}</SeedFieldButton.ErrorMessage>
              </SeedFieldButton.ErrorContainer>
            )}
          </SeedFieldButton.Footer>
        )}
        <SeedFieldButton.HiddenInputs />
      </SeedFieldButton.Root>
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

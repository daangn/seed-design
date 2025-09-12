"use client";

import * as React from "react";
import { FieldButton as SeedFieldButton } from "@seed-design/react";
import { visuallyHidden } from "@seed-design/dom-utils";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";

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

      disabled,
      name,

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

    return (
      <SeedFieldButton.Root disabled={disabled} name={name} ref={rootRef} {...otherProps}>
        {renderHeader && (
          <SeedFieldButton.Header>
            <SeedFieldButton.Label>
              {label}
              {indicator && <SeedFieldButton.Indicator>{indicator}</SeedFieldButton.Indicator>}
            </SeedFieldButton.Label>
          </SeedFieldButton.Header>
        )}
        <SeedFieldButton.Foobar>
          <SeedFieldButton.Button type="button" ref={ref} {...buttonProps} />
          {prefixIcon && <SeedFieldButton.PrefixIcon svg={prefixIcon} />}
          {prefix && <SeedFieldButton.PrefixText>{prefix}</SeedFieldButton.PrefixText>}
          {/* TODO: aria-hidden */}
          {children}
          {suffix && <SeedFieldButton.SuffixText>{suffix}</SeedFieldButton.SuffixText>}
          {suffixIcon && <SeedFieldButton.SuffixIcon svg={suffixIcon} />}
        </SeedFieldButton.Foobar>
        {renderFooter && (
          <SeedFieldButton.Footer>
            {renderDescription && (
              <SeedFieldButton.Description {...(renderErrorMessage && { style: visuallyHidden })}>
                {description}
              </SeedFieldButton.Description>
            )}
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

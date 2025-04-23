"use client";

import * as React from "react";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { TextField as SeedTextField } from "@seed-design/react";

export interface TextFieldProps extends Omit<SeedTextField.RootProps, "prefix"> {
  label?: React.ReactNode;

  indicator?: React.ReactNode;

  prefixIcon?: React.ReactNode;

  prefix?: React.ReactNode;

  suffixIcon?: React.ReactNode;

  suffix?: React.ReactNode;

  description?: React.ReactNode;

  errorMessage?: React.ReactNode;

  hideCharacterCount?: boolean;
}

/**
 * @see https://seed-design.io/react/components/text-fields/text-field
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      description,
      errorMessage,
      prefix,
      prefixIcon,
      suffix,
      suffixIcon,
      indicator,
      label,
      children,
      hideCharacterCount,
      ...otherProps
    },
    ref,
  ) => {
    const renderCharacterCount = !hideCharacterCount && otherProps.maxGraphemeCount;
    const renderDescription = description && !otherProps.invalid;
    const renderErrorMessage = errorMessage && otherProps.invalid;
    const renderFooter = renderDescription || renderErrorMessage || renderCharacterCount;
    const renderHeader = label || indicator;

    return (
      <SeedTextField.Root ref={ref} {...otherProps}>
        {renderHeader && (
          <SeedTextField.Header>
            <SeedTextField.Label>{label}</SeedTextField.Label>
            <SeedTextField.Indicator>{indicator}</SeedTextField.Indicator>
          </SeedTextField.Header>
        )}
        <SeedTextField.Field>
          {prefixIcon && <SeedTextField.PrefixIcon svg={prefixIcon} />}
          {prefix && <SeedTextField.PrefixText>{prefix}</SeedTextField.PrefixText>}
          {children}
          {suffix && <SeedTextField.SuffixText>{suffix}</SeedTextField.SuffixText>}
          {suffixIcon && <SeedTextField.SuffixIcon svg={suffixIcon} />}
        </SeedTextField.Field>
        {renderFooter && (
          <SeedTextField.Footer>
            {renderDescription && (
              <SeedTextField.Description>{description}</SeedTextField.Description>
            )}
            {renderErrorMessage && (
              <SeedTextField.ErrorMessage>
                <SeedTextField.ErrorIcon svg={<IconExclamationmarkCircleFill />} />
                {errorMessage}
              </SeedTextField.ErrorMessage>
            )}
            {renderCharacterCount && (
              <SeedTextField.CharacterCountArea>
                <SeedTextField.CharacterCount />
                <SeedTextField.MaxCharacterCount>
                  /{otherProps.maxGraphemeCount}
                </SeedTextField.MaxCharacterCount>
              </SeedTextField.CharacterCountArea>
            )}
          </SeedTextField.Footer>
        )}
      </SeedTextField.Root>
    );
  },
);
TextField.displayName = "TextField";

export interface TextFieldInputProps extends SeedTextField.InputProps {}

export const TextFieldInput = SeedTextField.Input;

export interface TextFieldTextareaProps extends SeedTextField.TextareaProps {}

export const TextFieldTextarea = SeedTextField.Textarea;

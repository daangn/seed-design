"use client";

import * as React from "react";
import {
  TextField as SeedTextField,
  Field as SeedField,
  type UseTextFieldWithGraphemesParams,
  useTextFieldWithGraphemes,
} from "@seed-design/react";
import { visuallyHidden } from "@seed-design/dom-utils";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";

export interface TextFieldProps extends Omit<SeedTextField.RootProps, "prefix" | "onValueChange"> {
  prefixIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  suffix?: React.ReactNode;

  label?: React.ReactNode;
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  hideGraphemeCount?: boolean;
  maxGraphemeCount?: number;

  onValueChange?: UseTextFieldWithGraphemesParams["onValueChange"];
}

/**
 * @see https://seed-design.io/react/components/text-field
 */
export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  (
    {
      prefix,
      prefixIcon,
      suffix,
      suffixIcon,
      label,
      indicator,
      description,
      errorMessage,
      hideGraphemeCount,
      children,
      maxGraphemeCount,

      // field props
      required,
      disabled,
      invalid,
      readOnly,
      name,

      ...otherProps
    },
    ref,
  ) => {
    const { textFieldRootProps, counterProps } = useTextFieldWithGraphemes({
      ...otherProps,
      maxGraphemeCount: maxGraphemeCount ?? 0,
    });

    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && invalid;
    const renderGraphemeCount = !hideGraphemeCount && maxGraphemeCount !== undefined;
    const renderFooter = renderDescription || renderErrorMessage || renderGraphemeCount;
    const renderHeader = label || indicator;

    // we are manually propagating the size because the variant props might not always match

    return (
      <SeedField.Root
        size={otherProps.size}
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        name={name}
        ref={ref}
      >
        {renderHeader && (
          <SeedField.Header>
            <SeedField.Label>{label}</SeedField.Label>
            <SeedField.Indicator>{indicator}</SeedField.Indicator>
          </SeedField.Header>
        )}
        <SeedTextField.Root {...otherProps} {...textFieldRootProps}>
          {prefixIcon && <SeedTextField.PrefixIcon svg={prefixIcon} />}
          {prefix && <SeedTextField.PrefixText>{prefix}</SeedTextField.PrefixText>}
          {children}
          {suffix && <SeedTextField.SuffixText>{suffix}</SeedTextField.SuffixText>}
          {suffixIcon && <SeedTextField.SuffixIcon svg={suffixIcon} />}
        </SeedTextField.Root>
        {renderFooter && (
          <SeedField.Footer>
            {renderDescription && (
              <SeedField.Description {...(renderErrorMessage && { style: visuallyHidden })}>
                {description}
              </SeedField.Description>
            )}
            {renderErrorMessage && (
              <SeedField.ErrorMessage>
                <SeedField.ErrorIcon svg={<IconExclamationmarkCircleFill />} />
                {errorMessage}
              </SeedField.ErrorMessage>
            )}
            {renderGraphemeCount && <SeedField.CharacterCount {...counterProps} />}
          </SeedField.Footer>
        )}
      </SeedField.Root>
    );
  },
);
TextField.displayName = "TextField";

export interface TextFieldInputProps extends SeedTextField.InputProps {}

/**
 * @see https://seed-design.io/react/components/text-field-input
 */
export const TextFieldInput = SeedTextField.Input;

export interface TextFieldTextareaProps extends SeedTextField.TextareaProps {}

/**
 * @see https://seed-design.io/react/components/text-field-textarea
 */
export const TextFieldTextarea = SeedTextField.Textarea;

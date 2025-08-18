"use client";

import * as React from "react";
import {
  TextField as SeedTextField,
  Field as SeedField,
  useTextFieldWithGraphemes,
  type UseTextFieldWithGraphemesParams,
} from "@seed-design/react";
import { visuallyHidden } from "@seed-design/dom-utils";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";

export interface TextFieldInputProps
  extends Omit<SeedTextField.RootProps, "prefix" | "onValueChange"> {
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

  inputProps?: SeedTextField.InputProps;

  onValueChange?: UseTextFieldWithGraphemesParams["onValueChange"];
}

/**
 * @see https://seed-design.io/react/components/text-field
 */
export const TextFieldInput = React.forwardRef<HTMLInputElement, TextFieldInputProps>(
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
      size,
      inputProps,
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
        size={size}
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        name={name}
      >
        {renderHeader && (
          <SeedField.Header>
            <SeedField.Label>{label}</SeedField.Label>
            <SeedField.Indicator>{indicator}</SeedField.Indicator>
          </SeedField.Header>
        )}
        <SeedTextField.Root size={size} {...otherProps} {...textFieldRootProps}>
          {prefixIcon && <SeedTextField.PrefixIcon svg={prefixIcon} />}
          {prefix && <SeedTextField.PrefixText>{prefix}</SeedTextField.PrefixText>}
          <SeedTextField.Input ref={ref} {...inputProps} />
          {suffix && <SeedTextField.SuffixText>{suffix}</SeedTextField.SuffixText>}
          {suffixIcon && <SeedTextField.SuffixIcon svg={suffixIcon} />}
        </SeedTextField.Root>
        {renderFooter && (
          <SeedField.Footer>
            {renderDescription && (
              <SeedField.Description {...(invalid && { style: visuallyHidden })}>
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
TextFieldInput.displayName = "TextFieldInput";

export interface TextFieldTextareaProps extends Omit<SeedTextField.RootProps, "onValueChange"> {
  label?: React.ReactNode;
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  hideGraphemeCount?: boolean;
  maxGraphemeCount?: number;

  textareaProps?: SeedTextField.TextareaProps;

  onValueChange?: UseTextFieldWithGraphemesParams["onValueChange"];
}

/**
 * @see https://seed-design.io/react/components/multiline-text-field
 */
export const TextFieldTextarea = React.forwardRef<HTMLTextAreaElement, TextFieldTextareaProps>(
  (
    {
      label,
      indicator,
      description,
      errorMessage,
      hideGraphemeCount,
      size,
      textareaProps,
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
        size={size}
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        name={name}
      >
        {renderHeader && (
          <SeedField.Header>
            <SeedField.Label>{label}</SeedField.Label>
            <SeedField.Indicator>{indicator}</SeedField.Indicator>
          </SeedField.Header>
        )}
        <SeedTextField.Root size={size} {...otherProps} {...textFieldRootProps}>
          <SeedTextField.Textarea ref={ref} {...textareaProps} />
        </SeedTextField.Root>
        {renderFooter && (
          <SeedField.Footer>
            {renderDescription && (
              <SeedField.Description {...(invalid && { style: visuallyHidden })}>
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
TextFieldTextarea.displayName = "TextFieldTextarea";

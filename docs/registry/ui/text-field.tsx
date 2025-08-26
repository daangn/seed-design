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
  label?: React.ReactNode;
  indicator?: React.ReactNode;

  prefixIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  suffix?: React.ReactNode;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  hideGraphemeCount?: boolean;
  maxGraphemeCount?: number;

  onValueChange?: UseTextFieldWithGraphemesParams["onValueChange"];
}

/**
 * @see https://seed-design.io/react/components/text-field-input
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

      // field props
      required,
      disabled,
      invalid,
      readOnly,
      name,

      // useTextFieldWithGraphemes params
      value,
      onValueChange,
      maxGraphemeCount,

      ...otherProps
    },
    ref,
  ) => {
    const { textFieldRootProps, counterProps } = useTextFieldWithGraphemes({
      value,
      onValueChange,
      maxGraphemeCount,
    });

    const renderHeader = label || indicator;
    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && invalid;
    const renderGraphemeCount = !hideGraphemeCount && maxGraphemeCount !== undefined;
    const renderFooter = renderDescription || renderErrorMessage || renderGraphemeCount;

    if (
      !label &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "TextField: aria-labelledby or aria-label should be provided if label is not provided.",
      );
    }

    // we are manually assigning the size to SeedField.Root because the variant props might not always match

    return (
      <SeedField.Root
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        name={name}
        ref={ref}
      >
        {renderHeader && (
          <SeedField.Header>
            <SeedField.Label>
              {label}
              {indicator}
            </SeedField.Label>
            {/* You might want to put your custom element here */}
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
              <SeedField.ErrorContainer>
                <SeedField.ErrorIcon svg={<IconExclamationmarkCircleFill />} />
                <SeedField.ErrorMessage>{errorMessage}</SeedField.ErrorMessage>
              </SeedField.ErrorContainer>
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

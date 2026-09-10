import * as React from "react";
import {
  TextField as SeedTextField,
  Field as SeedField,
  type UseTextFieldWithGraphemesParams,
  useTextFieldWithGraphemes,
  VisuallyHidden,
  PrefixIcon,
} from "@seed-design/react";
import type { FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";

export interface TextFieldProps
  extends Omit<SeedTextField.RootProps, "prefix" | "onValueChange" | "asChild"> {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: FieldLabelVariantProps["weight"];

  indicator?: React.ReactNode;

  prefixIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  suffix?: React.ReactNode;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;

  hideCharacterCount?: boolean;
  maxGraphemeCount?: number;
  showRequiredIndicator?: boolean;

  fieldRef?: React.Ref<HTMLDivElement>;

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
      labelWeight,
      indicator,
      description,
      errorMessage,
      hideCharacterCount,
      children,

      // field props
      required,
      disabled,
      invalid,
      readOnly,
      name,

      showRequiredIndicator,

      // useTextFieldWithGraphemes params
      value,
      onValueChange,
      maxGraphemeCount,

      fieldRef,

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
    const renderGraphemeCount = !hideCharacterCount && maxGraphemeCount !== undefined;
    const renderFooter = renderDescription || renderErrorMessage || renderGraphemeCount;

    if (process.env.NODE_ENV !== "production" && !label) {
      console.warn(
        "TextField: Provide a `label` prop for better accessibility. Please ignore this warning if you've provided `aria-label` or `aria-labelledby` props to the `TextFieldInput` or `TextFieldTextarea` inside. This warning will not be shown in production builds.",
      );
    }

    return (
      <SeedField.Root
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        name={name}
        ref={fieldRef}
      >
        {renderHeader && (
          <SeedField.Header>
            <SeedField.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator && <SeedField.RequiredIndicator />}
              {indicator && <SeedField.IndicatorText>{indicator}</SeedField.IndicatorText>}
            </SeedField.Label>
            {/* You might want to put your custom element here */}
          </SeedField.Header>
        )}
        <SeedTextField.Root ref={ref} {...otherProps} {...textFieldRootProps}>
          {prefixIcon && <SeedTextField.PrefixIcon svg={prefixIcon} />}
          {prefix && <SeedTextField.PrefixText>{prefix}</SeedTextField.PrefixText>}
          {children}
          {suffix && <SeedTextField.SuffixText>{suffix}</SeedTextField.SuffixText>}
          {suffixIcon && <SeedTextField.SuffixIcon svg={suffixIcon} />}
        </SeedTextField.Root>
        {renderFooter && (
          <SeedField.Footer>
            {renderDescription &&
              (renderErrorMessage ? (
                <VisuallyHidden asChild>
                  <SeedField.Description>{description}</SeedField.Description>
                </VisuallyHidden>
              ) : (
                <SeedField.Description>{description}</SeedField.Description>
              ))}
            {renderErrorMessage && (
              <SeedField.ErrorMessage>
                <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
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

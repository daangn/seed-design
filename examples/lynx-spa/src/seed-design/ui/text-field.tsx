import * as React from "@lynx-js/react";
import {
  Field as SeedField,
  TextField as SeedTextField,
  type UseTextFieldWithGraphemesParams,
  useTextFieldWithGraphemes,
} from "@seed-design/lynx-react";

type TextFieldRootRef = React.ComponentRef<typeof SeedTextField.Root>;
type FieldRootRef = React.ComponentRef<typeof SeedField.Root>;

export interface TextFieldProps
  extends Omit<SeedTextField.RootProps, "children" | "onValueChange"> {
  children?: React.ReactNode;
  label?: React.ReactNode;
  labelWeight?: SeedField.LabelProps["weight"];
  indicator?: React.ReactNode;
  prefixIcon?: SeedTextField.PrefixIconProps["icon"];
  prefix?: React.ReactNode;
  suffixIcon?: SeedTextField.SuffixIconProps["icon"];
  suffix?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  hideCharacterCount?: boolean;
  maxGraphemeCount?: number;
  showRequiredIndicator?: boolean;
  fieldRef?: React.Ref<FieldRootRef>;
  onValueChange?: UseTextFieldWithGraphemesParams["onValueChange"];
}

/**
 * @see https://seed-design.io/lynx/components/text-field-input
 */
export const TextField = React.forwardRef<TextFieldRootRef, TextFieldProps>(
  (
    {
      children,
      label,
      labelWeight,
      indicator,
      prefixIcon,
      prefix,
      suffixIcon,
      suffix,
      description,
      errorMessage,
      hideCharacterCount,
      maxGraphemeCount,
      showRequiredIndicator,
      fieldRef,
      value,
      defaultValue,
      onValueChange,
      required,
      disabled,
      invalid,
      readOnly,
      name,
      ...rootProps
    },
    ref,
  ) => {
    const { textFieldRootProps, counterProps } = useTextFieldWithGraphemes({
      value,
      defaultValue,
      onValueChange,
      maxGraphemeCount,
    });
    const renderHeader = label != null || indicator != null;
    const renderDescription = description != null && !(invalid && errorMessage != null);
    const renderErrorMessage = invalid && errorMessage != null;
    const renderCharacterCount = !hideCharacterCount && maxGraphemeCount !== undefined;
    const renderFooter = renderDescription || renderErrorMessage || renderCharacterCount;

    return (
      <SeedField.Root
        ref={fieldRef}
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
      >
        {renderHeader ? (
          <SeedField.Header>
            <SeedField.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator ? <SeedField.RequiredIndicator /> : null}
              {indicator != null ? (
                <SeedField.IndicatorText>{indicator}</SeedField.IndicatorText>
              ) : null}
            </SeedField.Label>
          </SeedField.Header>
        ) : null}
        <SeedTextField.Root ref={ref} name={name} {...rootProps} {...textFieldRootProps}>
          {prefixIcon ? <SeedTextField.PrefixIcon icon={prefixIcon} /> : null}
          {prefix != null ? <SeedTextField.PrefixText>{prefix}</SeedTextField.PrefixText> : null}
          {children}
          {suffix != null ? <SeedTextField.SuffixText>{suffix}</SeedTextField.SuffixText> : null}
          {suffixIcon ? <SeedTextField.SuffixIcon icon={suffixIcon} /> : null}
        </SeedTextField.Root>
        {renderFooter ? (
          <SeedField.Footer>
            {renderDescription ? (
              <SeedField.Description>{description}</SeedField.Description>
            ) : null}
            {renderErrorMessage ? (
              <SeedField.ErrorMessage>{errorMessage}</SeedField.ErrorMessage>
            ) : null}
            {renderCharacterCount ? <SeedField.CharacterCount {...counterProps} /> : null}
          </SeedField.Footer>
        ) : null}
      </SeedField.Root>
    );
  },
);
TextField.displayName = "TextField";

export interface TextFieldInputProps extends SeedTextField.InputProps {}

/**
 * @see https://seed-design.io/lynx/components/text-field-input
 */
export const TextFieldInput = SeedTextField.Input;

export interface TextFieldTextareaProps extends SeedTextField.TextareaProps {}

/**
 * @see https://seed-design.io/lynx/components/text-field-textarea
 */
export const TextFieldTextarea = SeedTextField.Textarea;

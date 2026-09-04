import IconXmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkCircleFill";
import * as React from "@lynx-js/react";
import { Field as SeedField, InputButton as SeedInputButton } from "@seed-design/lynx-react";

interface FieldButtonClearButtonProps extends Omit<SeedInputButton.ClearButtonProps, "icon"> {}

export interface FieldButtonProps extends Omit<SeedInputButton.RootProps, "children"> {
  children?: React.ReactNode;
  label?: React.ReactNode;
  labelWeight?: SeedField.LabelProps["weight"];
  indicator?: React.ReactNode;
  prefixIcon?: SeedInputButton.PrefixIconProps["icon"];
  prefix?: React.ReactNode;
  suffixIcon?: SeedInputButton.SuffixIconProps["icon"];
  suffix?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  required?: boolean;
  showRequiredIndicator?: boolean;
  showClearButton?: boolean;
  buttonProps?: SeedInputButton.ButtonProps;
  clearButtonProps?: FieldButtonClearButtonProps;
  fieldRef?: React.Ref<React.ComponentRef<typeof SeedField.Root>>;
  inputButtonRef?: React.Ref<React.ComponentRef<typeof SeedInputButton.Root>>;
}

/**
 * @see https://seed-design.io/lynx/components/input-button
 */
export const FieldButton = React.forwardRef<unknown, FieldButtonProps>((props, ref) => {
  const {
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
    required,
    showRequiredIndicator,
    showClearButton,
    buttonProps,
    clearButtonProps,
    fieldRef,
    inputButtonRef,
    disabled,
    invalid,
    readOnly,
    ...rootProps
  } = props;
  const renderHeader = label != null || indicator != null;
  const renderDescription = description != null && !(invalid && errorMessage != null);
  const renderErrorMessage = invalid && errorMessage != null;
  const renderFooter = renderDescription || renderErrorMessage;
  const renderClearButton = showClearButton && !disabled && !readOnly;

  if (process.env.NODE_ENV !== "production" && !buttonProps?.["accessibility-label"]) {
    console.warn("FieldButton: `buttonProps.accessibility-label` should be provided.");
  }

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
      <SeedInputButton.Root
        ref={inputButtonRef}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        {...rootProps}
      >
        <SeedInputButton.Button ref={ref} {...buttonProps} />
        {prefixIcon ? <SeedInputButton.PrefixIcon icon={prefixIcon} /> : null}
        {prefix != null ? <SeedInputButton.PrefixText>{prefix}</SeedInputButton.PrefixText> : null}
        {children}
        {renderClearButton ? (
          <SeedInputButton.ClearButton
            // 소비처에서 서비스 언어에 맞는 레이블로 재정의할 수 있습니다.
            accessibility-label="지우기"
            icon={<IconXmarkCircleFill />}
            {...clearButtonProps}
          />
        ) : null}
        {suffix != null ? <SeedInputButton.SuffixText>{suffix}</SeedInputButton.SuffixText> : null}
        {suffixIcon ? <SeedInputButton.SuffixIcon icon={suffixIcon} /> : null}
      </SeedInputButton.Root>
      {renderFooter ? (
        <SeedField.Footer>
          {renderDescription ? <SeedField.Description>{description}</SeedField.Description> : null}
          {renderErrorMessage ? (
            <SeedField.ErrorMessage>{errorMessage}</SeedField.ErrorMessage>
          ) : null}
        </SeedField.Footer>
      ) : null}
    </SeedField.Root>
  );
});
FieldButton.displayName = "FieldButton";

export interface FieldButtonValueProps extends SeedInputButton.ValueProps {}

/**
 * @see https://seed-design.io/lynx/components/input-button
 */
export const FieldButtonValue = SeedInputButton.Value;

export interface FieldButtonPlaceholderProps extends SeedInputButton.PlaceholderProps {}

/**
 * @see https://seed-design.io/lynx/components/input-button
 */
export const FieldButtonPlaceholder = SeedInputButton.Placeholder;

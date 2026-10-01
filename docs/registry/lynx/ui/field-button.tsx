import IconXmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkCircleFill";
import * as React from "@lynx-js/react";
import { Field as SeedField, FieldButton as SeedFieldButton } from "@seed-design/lynx-react";

interface FieldButtonClearButtonProps extends Omit<SeedFieldButton.ClearButtonProps, "icon"> {}

export interface FieldButtonProps extends Omit<SeedFieldButton.RootProps, "children"> {
  children?: React.ReactNode;
  label?: React.ReactNode;
  labelWeight?: SeedField.LabelProps["weight"];
  indicator?: React.ReactNode;
  prefixIcon?: SeedFieldButton.PrefixIconProps["icon"];
  prefix?: React.ReactNode;
  suffixIcon?: SeedFieldButton.SuffixIconProps["icon"];
  suffix?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  required?: boolean;
  showRequiredIndicator?: boolean;
  showClearButton?: boolean;
  buttonProps?: SeedFieldButton.ButtonProps;
  clearButtonProps?: FieldButtonClearButtonProps;
  fieldRef?: React.Ref<React.ComponentRef<typeof SeedField.Root>>;
  controlRef?: React.Ref<React.ComponentRef<typeof SeedFieldButton.Root>>;
}

/**
 * @see https://seed-design.io/lynx/components/field-button
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
    controlRef,
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
      <SeedFieldButton.Root
        ref={controlRef}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        {...rootProps}
      >
        <SeedFieldButton.Button ref={ref} {...buttonProps} />
        {prefixIcon ? <SeedFieldButton.PrefixIcon icon={prefixIcon} /> : null}
        {prefix != null ? <SeedFieldButton.PrefixText>{prefix}</SeedFieldButton.PrefixText> : null}
        {children}
        {renderClearButton ? (
          <SeedFieldButton.ClearButton
            // 소비처에서 서비스 언어에 맞는 레이블로 재정의할 수 있습니다.
            accessibility-label="지우기"
            icon={<IconXmarkCircleFill />}
            {...clearButtonProps}
          />
        ) : null}
        {suffix != null ? <SeedFieldButton.SuffixText>{suffix}</SeedFieldButton.SuffixText> : null}
        {suffixIcon ? <SeedFieldButton.SuffixIcon icon={suffixIcon} /> : null}
      </SeedFieldButton.Root>
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

export interface FieldButtonValueProps extends SeedFieldButton.ValueProps {}

/**
 * @see https://seed-design.io/lynx/components/field-button
 */
export const FieldButtonValue = SeedFieldButton.Value;

export interface FieldButtonPlaceholderProps extends SeedFieldButton.PlaceholderProps {}

/**
 * @see https://seed-design.io/lynx/components/field-button
 */
export const FieldButtonPlaceholder = SeedFieldButton.Placeholder;

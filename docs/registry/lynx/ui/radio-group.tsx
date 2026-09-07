import * as React from "@lynx-js/react";
import { Field as SeedField, RadioGroup as SeedRadioGroup } from "@seed-design/lynx-react";

type FieldRootRef = React.ComponentRef<typeof SeedField.Root>;

export interface RadioGroupProps
  extends SeedRadioGroup.RootProps,
    Pick<SeedField.RootProps, "required" | "invalid" | "readOnly"> {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: SeedField.LabelProps["weight"];
  indicator?: React.ReactNode;
  showRequiredIndicator?: boolean;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/radio-group
 */
export const RadioGroup = React.forwardRef<FieldRootRef, RadioGroupProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      showRequiredIndicator,
      description,
      errorMessage,
      children,
      "accessibility-label": accessibilityLabel,
      value,
      defaultValue,
      onValueChange,
      disabled,
      required,
      invalid,
      readOnly,
      weight,
      size,
      tone,
      ...fieldProps
    },
    ref,
  ) => {
    const renderHeader = label != null || indicator != null;
    const renderErrorMessage = invalid && errorMessage != null;
    const renderDescription = description != null && !renderErrorMessage;
    const renderFooter = renderDescription || renderErrorMessage;
    const defaultAccessibilityLabel = typeof label === "string" ? label : undefined;

    return (
      <SeedField.Root
        ref={ref}
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        {...fieldProps}
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
        <SeedRadioGroup.Root
          accessibility-label={accessibilityLabel ?? defaultAccessibilityLabel}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled}
          weight={weight}
          size={size}
          tone={tone}
        >
          {children}
        </SeedRadioGroup.Root>
        {renderFooter ? (
          <SeedField.Footer>
            {renderDescription ? (
              <SeedField.Description>{description}</SeedField.Description>
            ) : null}
            {renderErrorMessage ? (
              <SeedField.ErrorMessage>{errorMessage}</SeedField.ErrorMessage>
            ) : null}
          </SeedField.Footer>
        ) : null}
      </SeedField.Root>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps extends SeedRadioGroup.ItemProps {
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/radio-group
 */
export const RadioGroupItem = React.forwardRef<unknown, RadioGroupItemProps>(
  ({ label, children, "accessibility-label": accessibilityLabel, ...otherProps }, ref) => {
    const defaultAccessibilityLabel = typeof label === "string" ? label : undefined;

    return (
      <SeedRadioGroup.Item
        ref={ref}
        accessibility-label={accessibilityLabel ?? defaultAccessibilityLabel}
        {...otherProps}
      >
        <SeedRadioGroup.ItemControl>
          <SeedRadioGroup.ItemIndicator />
        </SeedRadioGroup.ItemControl>
        {label != null ? <SeedRadioGroup.ItemLabel>{label}</SeedRadioGroup.ItemLabel> : null}
        {children}
      </SeedRadioGroup.Item>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export interface RadiomarkProps extends Omit<SeedRadioGroup.ItemControlProps, "children"> {}

/**
 * @see https://seed-design.io/lynx/components/radio-group
 */
export const Radiomark = React.forwardRef<unknown, RadiomarkProps>((props, ref) => {
  return (
    <SeedRadioGroup.ItemControl ref={ref} {...props}>
      <SeedRadioGroup.ItemIndicator />
    </SeedRadioGroup.ItemControl>
  );
});
Radiomark.displayName = "Radiomark";

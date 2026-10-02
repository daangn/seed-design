import * as React from "@lynx-js/react";
import {
  RadioGroup as SeedRadioGroup,
  RadioGroupField as SeedRadioGroupField,
} from "@seed-design/lynx-react";

export interface RadioGroupProps extends SeedRadioGroupField.RootProps {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: SeedRadioGroupField.LabelProps["weight"];
  indicator?: React.ReactNode;
  showRequiredIndicator?: boolean;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/radio-group
 */
export const RadioGroup = React.forwardRef<unknown, RadioGroupProps>(
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
      ...props
    },
    ref,
  ) => {
    const renderHeader = label != null || indicator != null;
    const renderErrorMessage = props.invalid && errorMessage != null;
    const renderDescription = description != null && !renderErrorMessage;
    const renderFooter = renderDescription || renderErrorMessage;
    const defaultAccessibilityLabel = typeof label === "string" ? label : undefined;

    return (
      <SeedRadioGroupField.Root
        ref={ref}
        accessibility-label={accessibilityLabel ?? defaultAccessibilityLabel}
        {...props}
      >
        {renderHeader ? (
          <SeedRadioGroupField.Header>
            <SeedRadioGroupField.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator ? <SeedRadioGroupField.RequiredIndicator /> : null}
              {indicator != null ? (
                <SeedRadioGroupField.IndicatorText>{indicator}</SeedRadioGroupField.IndicatorText>
              ) : null}
            </SeedRadioGroupField.Label>
          </SeedRadioGroupField.Header>
        ) : null}
        <SeedRadioGroup.Root>{children}</SeedRadioGroup.Root>
        {renderFooter ? (
          <SeedRadioGroupField.Footer>
            {renderDescription ? (
              <SeedRadioGroupField.Description>{description}</SeedRadioGroupField.Description>
            ) : null}
            {renderErrorMessage ? (
              <SeedRadioGroupField.ErrorMessage>{errorMessage}</SeedRadioGroupField.ErrorMessage>
            ) : null}
          </SeedRadioGroupField.Footer>
        ) : null}
      </SeedRadioGroupField.Root>
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

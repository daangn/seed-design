import * as React from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFatFill from "@karrotmarket/lynx-monochrome-icon/IconMinusFatFill";
import { Checkbox as SeedCheckbox, Field as SeedField } from "@seed-design/lynx-react";

type FieldRootRef = React.ComponentRef<typeof SeedField.Root>;

export interface CheckboxProps extends SeedCheckbox.RootProps {
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/checkbox
 */
export const Checkbox = React.forwardRef<unknown, CheckboxProps>(
  ({ label, children, "accessibility-label": accessibilityLabel, ...otherProps }, ref) => {
    return (
      <SeedCheckbox.Root
        ref={ref}
        accessibility-label={accessibilityLabel ?? (typeof label === "string" ? label : undefined)}
        {...otherProps}
      >
        <SeedCheckbox.Control>
          <SeedCheckbox.Indicator
            unchecked={otherProps.variant === "ghost" ? <IconCheckmarkFatFill /> : undefined}
            checked={<IconCheckmarkFatFill />}
            indeterminate={<IconMinusFatFill />}
          />
        </SeedCheckbox.Control>
        {label != null ? <SeedCheckbox.Label>{label}</SeedCheckbox.Label> : null}
        {children}
      </SeedCheckbox.Root>
    );
  },
);
Checkbox.displayName = "Checkbox";

export interface CheckmarkProps extends Omit<SeedCheckbox.RootProps, "children"> {}

/**
 * @see https://seed-design.io/lynx/components/checkbox
 */
export const Checkmark = React.forwardRef<unknown, CheckmarkProps>((props, ref) => {
  return (
    <SeedCheckbox.Root ref={ref} {...props}>
      <SeedCheckbox.Control>
        <SeedCheckbox.Indicator
          unchecked={props.variant === "ghost" ? <IconCheckmarkFatFill /> : undefined}
          checked={<IconCheckmarkFatFill />}
          indeterminate={<IconMinusFatFill />}
        />
      </SeedCheckbox.Control>
    </SeedCheckbox.Root>
  );
});
Checkmark.displayName = "Checkmark";

export interface CheckboxGroupProps
  extends SeedCheckbox.GroupProps,
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
 * @see https://seed-design.io/lynx/components/checkbox
 */
export const CheckboxGroup = React.forwardRef<FieldRootRef, CheckboxGroupProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      showRequiredIndicator,
      description,
      errorMessage,
      children,
      ...fieldProps
    },
    ref,
  ) => {
    const renderHeader = label != null || indicator != null;
    const renderErrorMessage = errorMessage != null;
    const renderDescription = description != null && !renderErrorMessage;
    const renderFooter = renderDescription || renderErrorMessage;

    return (
      <SeedField.Root ref={ref} {...fieldProps}>
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
        <SeedCheckbox.Group>{children}</SeedCheckbox.Group>
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
CheckboxGroup.displayName = "CheckboxGroup";

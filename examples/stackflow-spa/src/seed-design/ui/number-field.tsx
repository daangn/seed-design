import * as SeedNumberField from "@seed-design/react-number-field";
import * as React from "react";

export interface NumberFieldProps extends SeedNumberField.NumberFieldRootProps {}

/**
 * NumberField component for numeric input
 * @see https://seed-design.io/react/components/number-field
 */
export const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ ...otherProps }, ref) => {
    return (
      <SeedNumberField.NumberFieldRoot {...otherProps}>
        <SeedNumberField.NumberFieldInput ref={ref} />
        <SeedNumberField.NumberFieldDecrementButton>-</SeedNumberField.NumberFieldDecrementButton>
        <SeedNumberField.NumberFieldIncrementButton>+</SeedNumberField.NumberFieldIncrementButton>
      </SeedNumberField.NumberFieldRoot>
    );
  },
);
NumberField.displayName = "NumberField";

export const NumberFieldInput = SeedNumberField.NumberFieldInput;
export const NumberFieldIncrementButton = SeedNumberField.NumberFieldIncrementButton;
export const NumberFieldDecrementButton = SeedNumberField.NumberFieldDecrementButton;

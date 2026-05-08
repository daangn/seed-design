import * as React from "@lynx-js/react";
import { RadioGroup as SeedRadioGroup } from "@seed-design/lynx-react";

export interface RadioGroupProps extends SeedRadioGroup.RootProps {}

/**
 * @see https://seed-design.io/lynx/components/radio-group
 */
export const RadioGroup = React.forwardRef<unknown, RadioGroupProps>(
  ({ children, ...otherProps }, ref) => {
    return (
      <SeedRadioGroup.Root ref={ref} {...otherProps}>
        {children}
      </SeedRadioGroup.Root>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

export interface RadioProps extends SeedRadioGroup.ItemProps {
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/radio-group
 */
export const Radio = React.forwardRef<unknown, RadioProps>(
  ({ label, children, ...otherProps }, ref) => {
    return (
      <SeedRadioGroup.Item ref={ref} {...otherProps}>
        <SeedRadioGroup.ItemControl>
          <SeedRadioGroup.ItemIndicator />
        </SeedRadioGroup.ItemControl>
        {label != null ? <SeedRadioGroup.ItemLabel>{label}</SeedRadioGroup.ItemLabel> : null}
        {children}
      </SeedRadioGroup.Item>
    );
  },
);
Radio.displayName = "Radio";

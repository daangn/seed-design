import * as React from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFill from "@karrotmarket/lynx-monochrome-icon/IconMinusFill";
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  type CheckboxRootProps,
} from "@seed-design/lynx-react";

export interface CheckboxProps extends CheckboxRootProps {
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/checkbox
 */
export const Checkbox = React.forwardRef<unknown, CheckboxProps>(
  ({ label, children, ...otherProps }, ref) => {
    return (
      <CheckboxRoot ref={ref} {...otherProps}>
        <CheckboxControl>
          <CheckboxIndicator
            unchecked={<IconCheckmarkFatFill />}
            checked={<IconCheckmarkFatFill />}
            indeterminate={<IconMinusFill />}
          />
        </CheckboxControl>
        {label != null ? <CheckboxLabel>{label}</CheckboxLabel> : null}
        {children}
      </CheckboxRoot>
    );
  },
);
Checkbox.displayName = "Checkbox";

export interface CheckmarkProps extends Omit<CheckboxRootProps, "children"> {}

/**
 * @see https://seed-design.io/lynx/components/checkbox
 */
export const Checkmark = React.forwardRef<unknown, CheckmarkProps>((props, ref) => {
  return (
    <CheckboxRoot ref={ref} {...props}>
      <CheckboxControl>
        <CheckboxIndicator checked={<IconCheckmarkFatFill />} indeterminate={<IconMinusFill />} />
      </CheckboxControl>
    </CheckboxRoot>
  );
});
Checkmark.displayName = "Checkmark";

export { CheckboxGroup };
export type { CheckboxGroupProps } from "@seed-design/lynx-react";

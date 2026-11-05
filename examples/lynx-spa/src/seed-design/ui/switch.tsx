import * as React from "@lynx-js/react";
import { Switch as SeedSwitch } from "@seed-design/lynx-react";

export interface SwitchProps extends SeedSwitch.RootProps {
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/switch
 */
export const Switch = React.forwardRef<unknown, SwitchProps>(
  ({ label, children, ...otherProps }, ref) => {
    return (
      <SeedSwitch.Root ref={ref} {...otherProps}>
        <SeedSwitch.Control>
          <SeedSwitch.Thumb />
        </SeedSwitch.Control>
        {label != null ? <SeedSwitch.Label>{label}</SeedSwitch.Label> : null}
        {children}
      </SeedSwitch.Root>
    );
  },
);
Switch.displayName = "Switch";

export interface SwitchmarkProps extends SeedSwitch.ControlProps {}

/**
 * `Switch.Root` 안에서 레이블 없이 스위치 모양만 렌더링합니다.
 *
 * @see https://seed-design.io/lynx/components/switch
 */
export const Switchmark = React.forwardRef<unknown, SwitchmarkProps>((props, ref) => {
  return (
    <SeedSwitch.Control ref={ref} {...props}>
      <SeedSwitch.Thumb />
    </SeedSwitch.Control>
  );
});
Switchmark.displayName = "Switchmark";

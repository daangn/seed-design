import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import * as React from "@lynx-js/react";
import {
  CheckSelectBox as SeedCheckSelectBox,
  RadioSelectBox as SeedRadioSelectBox,
} from "@seed-design/lynx-react";

export const CheckSelectBoxGroup = SeedCheckSelectBox.Group;
export type CheckSelectBoxGroupProps = SeedCheckSelectBox.GroupProps;

export interface CheckSelectBoxProps extends Omit<SeedCheckSelectBox.RootProps, "children"> {
  label: string;
  labelAccessory?: React.ReactNode;
  description?: string;
  prefixIcon?: React.ReactNode;
  suffix?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/select-box
 */
export const CheckSelectBox = React.forwardRef<unknown, CheckSelectBoxProps>(
  ({ label, labelAccessory, description, prefixIcon, suffix, footer, ...otherProps }, ref) => (
    <SeedCheckSelectBox.Root ref={ref} accessibility-label={label} {...otherProps}>
      <SeedCheckSelectBox.Trigger>
        <SeedCheckSelectBox.Content>
          {prefixIcon}
          <SeedCheckSelectBox.Body>
            {labelAccessory ? (
              <view
                style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "6px" }}
              >
                <SeedCheckSelectBox.Label>{label}</SeedCheckSelectBox.Label>
                {labelAccessory}
              </view>
            ) : (
              <SeedCheckSelectBox.Label>{label}</SeedCheckSelectBox.Label>
            )}
            {description ? (
              <SeedCheckSelectBox.Description>{description}</SeedCheckSelectBox.Description>
            ) : null}
          </SeedCheckSelectBox.Body>
        </SeedCheckSelectBox.Content>
        {suffix}
      </SeedCheckSelectBox.Trigger>
      {footer ? <SeedCheckSelectBox.Footer>{footer}</SeedCheckSelectBox.Footer> : null}
    </SeedCheckSelectBox.Root>
  ),
);
CheckSelectBox.displayName = "CheckSelectBox";

export type CheckSelectBoxCheckmarkProps = SeedCheckSelectBox.CheckmarkControlProps;

export const CheckSelectBoxCheckmark = React.forwardRef<unknown, CheckSelectBoxCheckmarkProps>(
  (props, ref) => (
    <SeedCheckSelectBox.CheckmarkControl ref={ref} {...props}>
      <SeedCheckSelectBox.CheckmarkIcon icon={<IconCheckmarkFatFill />} />
    </SeedCheckSelectBox.CheckmarkControl>
  ),
);
CheckSelectBoxCheckmark.displayName = "CheckSelectBoxCheckmark";

export const RadioSelectBoxRoot = SeedRadioSelectBox.Group;
export type RadioSelectBoxRootProps = SeedRadioSelectBox.GroupProps;

export interface RadioSelectBoxItemProps extends Omit<SeedRadioSelectBox.ItemProps, "children"> {
  label: string;
  labelAccessory?: React.ReactNode;
  description?: string;
  prefixIcon?: React.ReactNode;
  suffix?: React.ReactNode;
  footer?: React.ReactNode;
}

export const RadioSelectBoxItem = React.forwardRef<unknown, RadioSelectBoxItemProps>(
  ({ label, labelAccessory, description, prefixIcon, suffix, footer, ...otherProps }, ref) => (
    <SeedRadioSelectBox.Item ref={ref} accessibility-label={label} {...otherProps}>
      <SeedRadioSelectBox.Trigger>
        <SeedRadioSelectBox.Content>
          {prefixIcon}
          <SeedRadioSelectBox.Body>
            {labelAccessory ? (
              <view
                style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "6px" }}
              >
                <SeedRadioSelectBox.Label>{label}</SeedRadioSelectBox.Label>
                {labelAccessory}
              </view>
            ) : (
              <SeedRadioSelectBox.Label>{label}</SeedRadioSelectBox.Label>
            )}
            {description ? (
              <SeedRadioSelectBox.Description>{description}</SeedRadioSelectBox.Description>
            ) : null}
          </SeedRadioSelectBox.Body>
        </SeedRadioSelectBox.Content>
        {suffix}
      </SeedRadioSelectBox.Trigger>
      {footer ? <SeedRadioSelectBox.Footer>{footer}</SeedRadioSelectBox.Footer> : null}
    </SeedRadioSelectBox.Item>
  ),
);
RadioSelectBoxItem.displayName = "RadioSelectBoxItem";

export type RadioSelectBoxRadiomarkProps = SeedRadioSelectBox.RadiomarkProps;
export const RadioSelectBoxRadiomark = SeedRadioSelectBox.Radiomark;

"use client";

import { IconCheckmarkFatFill } from "@karrotmarket/react-monochrome-icon";
import {
  RadioSelectBox as SeedRadioSelectBox,
  CheckSelectBox as SeedCheckSelectBox,
  PrefixIcon,
} from "@seed-design/react";
import { RadioMark, type RadioMarkProps } from "./radio-group";
import * as React from "react";

export interface RadioSelectBoxRootProps extends SeedRadioSelectBox.RootProps {}

/**
 * @see https://seed-design.io/react/components/select-box
 */
export const RadioSelectBoxRoot = React.forwardRef<HTMLDivElement, RadioSelectBoxRootProps>(
  (props, ref) => {
    if (!props["aria-label"] && !props["aria-labelledby"]) {
      console.warn(
        "RadioSelectBoxRoot component requires either an `aria-label` or `aria-labelledby` attribute.",
      );
    }

    return <SeedRadioSelectBox.Root ref={ref} {...props} />;
  },
);

export interface RadioSelectBoxItemProps extends Omit<SeedRadioSelectBox.ItemProps, "children"> {
  label: React.ReactNode;

  description?: React.ReactNode;

  prefixIcon?: React.ReactNode;

  suffix?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;

  footer?: React.ReactNode;
}

export const RadioSelectBoxItem = React.forwardRef<HTMLInputElement, RadioSelectBoxItemProps>(
  ({ label, description, prefixIcon, suffix, inputProps, rootRef, footer, ...otherProps }, ref) => {
    return (
      <SeedRadioSelectBox.Item ref={rootRef} {...otherProps}>
        <SeedRadioSelectBox.Trigger>
          <SeedRadioSelectBox.HiddenInput ref={ref} {...inputProps} />
          <SeedRadioSelectBox.Content>
            {prefixIcon && <PrefixIcon svg={prefixIcon} />}
            <SeedRadioSelectBox.Body>
              <SeedRadioSelectBox.Label>{label}</SeedRadioSelectBox.Label>
              {description && (
                <SeedRadioSelectBox.Description>{description}</SeedRadioSelectBox.Description>
              )}
            </SeedRadioSelectBox.Body>
          </SeedRadioSelectBox.Content>
          {suffix}
        </SeedRadioSelectBox.Trigger>
        {footer && <SeedRadioSelectBox.Footer>{footer}</SeedRadioSelectBox.Footer>}
      </SeedRadioSelectBox.Item>
    );
  },
);
RadioSelectBoxItem.displayName = "RadioSelectBoxItem";

export interface CheckSelectBoxProps extends Omit<SeedCheckSelectBox.RootProps, "children"> {
  label: React.ReactNode;

  description?: React.ReactNode;

  prefixIcon?: React.ReactNode;

  suffix?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;

  footer?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/select-box
 */
export const CheckSelectBox = React.forwardRef<HTMLInputElement, CheckSelectBoxProps>(
  ({ label, description, prefixIcon, suffix, inputProps, rootRef, footer, ...otherProps }, ref) => {
    return (
      <SeedCheckSelectBox.Root ref={rootRef} {...otherProps}>
        <SeedCheckSelectBox.Trigger>
          <SeedCheckSelectBox.HiddenInput ref={ref} {...inputProps} />
          <SeedCheckSelectBox.Content>
            {prefixIcon && <PrefixIcon svg={prefixIcon} />}
            <SeedCheckSelectBox.Body>
              <SeedCheckSelectBox.Label>{label}</SeedCheckSelectBox.Label>
              {description && (
                <SeedCheckSelectBox.Description>{description}</SeedCheckSelectBox.Description>
              )}
            </SeedCheckSelectBox.Body>
          </SeedCheckSelectBox.Content>
          {suffix}
        </SeedCheckSelectBox.Trigger>
        {footer && <SeedCheckSelectBox.Footer>{footer}</SeedCheckSelectBox.Footer>}
      </SeedCheckSelectBox.Root>
    );
  },
);
CheckSelectBox.displayName = "CheckSelectBox";

export interface CheckSelectBoxGroupProps extends SeedCheckSelectBox.GroupProps {}

export const CheckSelectBoxGroup = SeedCheckSelectBox.Group;

export interface CheckSelectBoxCheckmarkProps extends SeedCheckSelectBox.CheckmarkControlProps {}

export const CheckSelectBoxCheckmark = React.forwardRef<
  HTMLDivElement,
  CheckSelectBoxCheckmarkProps
>((props, ref) => {
  return (
    <SeedCheckSelectBox.CheckmarkControl ref={ref} {...props}>
      <SeedCheckSelectBox.CheckmarkIcon svg={<IconCheckmarkFatFill />} />
    </SeedCheckSelectBox.CheckmarkControl>
  );
});
CheckSelectBoxCheckmark.displayName = "CheckSelectBoxCheckmark";

export interface RadioSelectBoxRadioMarkProps extends RadioMarkProps {}

export const RadioSelectBoxRadioMark = React.forwardRef<
  HTMLDivElement,
  RadioSelectBoxRadioMarkProps
>((props, ref) => {
  return <RadioMark ref={ref} size="medium" tone="neutral" {...props} />;
});
RadioSelectBoxRadioMark.displayName = "RadioSelectBoxRadioMark";

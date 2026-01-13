"use client";

import { IconCheckmarkFatFill } from "@karrotmarket/react-monochrome-icon";
import {
  RadioSelectBox as SeedRadioSelectBox,
  CheckSelectBox as SeedCheckSelectBox,
  RadioGroup as SeedRadioGroup,
  PrefixIcon,
} from "@seed-design/react";
import { RadioMark, type RadioMarkProps } from "./radio-group";
import * as React from "react";

export interface RadioSelectBoxRootProps extends SeedRadioSelectBox.RootProps {}

/**
 * @see https://seed-design.io/react/components/select-box/radio-select-box
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

export interface RadioSelectBoxItemProps extends SeedRadioSelectBox.ItemProps {
  label: React.ReactNode;

  description?: React.ReactNode;

  prefixIcon?: React.ReactNode;

  suffix?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

export const RadioSelectBoxItem = React.forwardRef<HTMLInputElement, RadioSelectBoxItemProps>(
  ({ label, description, prefixIcon, suffix, inputProps, rootRef, ...otherProps }, ref) => {
    return (
      <SeedRadioSelectBox.Item ref={rootRef} {...otherProps}>
        <SeedRadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
        <SeedRadioSelectBox.Foo>
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
        </SeedRadioSelectBox.Foo>
      </SeedRadioSelectBox.Item>
    );
  },
);
RadioSelectBoxItem.displayName = "RadioSelectBoxItem";

export interface CheckSelectBoxProps extends SeedCheckSelectBox.RootProps {
  label: React.ReactNode;

  description?: React.ReactNode;

  prefixIcon?: React.ReactNode;

  suffix?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/select-box/check-select-box
 */
export const CheckSelectBox = React.forwardRef<HTMLInputElement, CheckSelectBoxProps>(
  ({ label, description, prefixIcon, suffix, inputProps, rootRef, ...otherProps }, ref) => {
    return (
      <SeedCheckSelectBox.Root ref={rootRef} {...otherProps}>
        <SeedCheckSelectBox.HiddenInput ref={ref} {...inputProps} />
        <SeedCheckSelectBox.Foo>
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
        </SeedCheckSelectBox.Foo>
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

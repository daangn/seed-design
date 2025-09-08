"use client";

import {
  RadioSelectBox as SeedRadioSelectBox,
  CheckSelectBox as SeedCheckSelectBox,
  RadioGroup as SeedRadioGroup,
  Checkbox as SeedCheckbox,
} from "@seed-design/react";
import { RadioMark } from "./radio-group";
import { Checkmark } from "./checkbox";
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

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

export const RadioSelectBoxItem = React.forwardRef<HTMLInputElement, RadioSelectBoxItemProps>(
  ({ label, description, inputProps, rootRef, ...otherProps }, ref) => {
    return (
      <SeedRadioSelectBox.Item ref={rootRef} {...otherProps}>
        <SeedRadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
        <SeedRadioSelectBox.Content>
          <SeedRadioSelectBox.Label>{label}</SeedRadioSelectBox.Label>
          {description && (
            <SeedRadioSelectBox.Description>{description}</SeedRadioSelectBox.Description>
          )}
        </SeedRadioSelectBox.Content>
        <RadioMark size="large" />
      </SeedRadioSelectBox.Item>
    );
  },
);
RadioSelectBoxItem.displayName = "RadioSelectBoxItem";

export interface CheckSelectBoxProps extends SeedCheckSelectBox.RootProps {
  label: React.ReactNode;

  description?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/select-box/check-select-box
 */
export const CheckSelectBox = React.forwardRef<HTMLInputElement, CheckSelectBoxProps>(
  ({ label, description, inputProps, rootRef, ...otherProps }, ref) => {
    return (
      <SeedCheckSelectBox.Root ref={rootRef} {...otherProps}>
        <SeedCheckbox.HiddenInput ref={ref} {...inputProps} />
        <SeedCheckSelectBox.Content>
          <SeedCheckSelectBox.Label>{label}</SeedCheckSelectBox.Label>
          {description && (
            <SeedCheckSelectBox.Description>{description}</SeedCheckSelectBox.Description>
          )}
        </SeedCheckSelectBox.Content>
        <Checkmark size="large" />
      </SeedCheckSelectBox.Root>
    );
  },
);
CheckSelectBox.displayName = "CheckSelectBox";

export interface CheckSelectBoxGroupProps extends SeedCheckSelectBox.GroupProps {}

export const CheckSelectBoxGroup = SeedCheckSelectBox.Group;

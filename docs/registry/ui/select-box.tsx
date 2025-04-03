"use client";

import { IconCheckmarkFatFill } from "@karrotmarket/react-monochrome-icon";
import {
  CheckSelectBox as SeedCheckSelectBox,
  RadioSelectBox as SeedRadioSelectBox,
} from "@seed-design/react";
import * as React from "react";

export interface RadioSelectBoxRootProps extends SeedRadioSelectBox.RootProps {}

/**
 * @see https://seed-design.io/react/components/select-box/radio-select-box
 */
export const RadioSelectBoxRoot = React.forwardRef<
  HTMLDivElement,
  RadioSelectBoxRootProps
>((props, ref) => {
  if (!props["aria-label"] && !props["aria-labelledby"]) {
    console.warn(
      "RadioSelectBoxRoot component requires either an `aria-label` or `aria-labelledby` attribute.",
    );
  }

  return <SeedRadioSelectBox.Root ref={ref} {...props} />;
});

export interface RadioSelectBoxItemProps extends SeedRadioSelectBox.ItemProps {
  label: string;

  description?: string;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

export const RadioSelectBoxItem = React.forwardRef<
  HTMLInputElement,
  RadioSelectBoxItemProps
>(({ label, description, inputProps, rootRef, ...otherProps }, ref) => {
  return (
    <SeedRadioSelectBox.Item ref={rootRef} {...otherProps}>
      <SeedRadioSelectBox.HiddenInput ref={ref} {...inputProps} />
      <SeedRadioSelectBox.Content>
        <SeedRadioSelectBox.Label>{label}</SeedRadioSelectBox.Label>
        {description && (
          <SeedRadioSelectBox.Description>
            {description}
          </SeedRadioSelectBox.Description>
        )}
      </SeedRadioSelectBox.Content>
      <SeedRadioSelectBox.Control>
        <SeedRadioSelectBox.Icon
          svg={
            <svg aria-hidden viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="currentColor" />
            </svg>
          }
        />
      </SeedRadioSelectBox.Control>
    </SeedRadioSelectBox.Item>
  );
});
RadioSelectBoxItem.displayName = "RadioSelectBoxItem";

export interface CheckSelectBoxProps extends SeedCheckSelectBox.RootProps {
  label: string;

  description?: string;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/select-box/check-select-box
 */
export const CheckSelectBox = React.forwardRef<
  HTMLInputElement,
  CheckSelectBoxProps
>(({ label, description, inputProps, rootRef, ...otherProps }, ref) => {
  return (
    <SeedCheckSelectBox.Root ref={rootRef} {...otherProps}>
      <SeedCheckSelectBox.HiddenInput ref={ref} {...inputProps} />
      <SeedCheckSelectBox.Content>
        <SeedCheckSelectBox.Label>{label}</SeedCheckSelectBox.Label>
        {description && (
          <SeedCheckSelectBox.Description>
            {description}
          </SeedCheckSelectBox.Description>
        )}
      </SeedCheckSelectBox.Content>
      <SeedCheckSelectBox.Control>
        <SeedCheckSelectBox.Icon svg={<IconCheckmarkFatFill />} />
      </SeedCheckSelectBox.Control>
    </SeedCheckSelectBox.Root>
  );
});
CheckSelectBox.displayName = "CheckSelectBox";

export interface CheckSelectBoxGroupProps
  extends SeedCheckSelectBox.GroupProps {}

export const CheckSelectBoxGroup = SeedCheckSelectBox.Group;

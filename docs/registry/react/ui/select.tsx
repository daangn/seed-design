"use client";

import { PrefixIcon, Select as SeedSelect } from "@seed-design/react";
import {
  IconCheckmarkFatFill,
  IconChevronDownSmallLine,
} from "@karrotmarket/react-monochrome-icon";
import * as React from "react";

export interface SelectRootProps extends SeedSelect.RootProps {}

/**
 * @see https://seed-design.io/react/components/select
 */
export const SelectRoot = ({ children, ...props }: SelectRootProps) => (
  <SeedSelect.Root {...props}>
    {children}
    <SeedSelect.HiddenSelect />
  </SeedSelect.Root>
);

export interface SelectTriggerProps extends Omit<SeedSelect.TriggerProps, "children"> {
  placeholder?: React.ReactNode;

  prefixIcon?: React.ReactNode;

  /**
   * @default <IconChevronDownSmallLine />
   */
  suffixIcon?: React.ReactNode;

  format?: SeedSelect.ValueProps["format"];
}

/**
 * @see https://seed-design.io/react/components/select
 */
export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ placeholder, prefixIcon, suffixIcon, format, ...props }, ref) => {
    return (
      <SeedSelect.Trigger ref={ref} {...props}>
        {prefixIcon && <SeedSelect.PrefixIcon svg={prefixIcon} />}
        <SeedSelect.Value format={format} />
        {placeholder && <SeedSelect.Placeholder>{placeholder}</SeedSelect.Placeholder>}
        <SeedSelect.SuffixIcon svg={suffixIcon ?? <IconChevronDownSmallLine />} />
      </SeedSelect.Trigger>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectContentProps extends SeedSelect.ContentProps {
  positionerContainer?: SeedSelect.PositionerProps["container"];
}

/**
 * @see https://seed-design.io/react/components/select
 */
export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, positionerContainer, ...props }, ref) => {
    return (
      <SeedSelect.Positioner container={positionerContainer}>
        <SeedSelect.Content ref={ref} {...props}>
          <SeedSelect.ScrollArea>{children}</SeedSelect.ScrollArea>
        </SeedSelect.Content>
      </SeedSelect.Positioner>
    );
  },
);
SelectContent.displayName = "SelectContent";

export interface SelectGroupProps extends SeedSelect.GroupProps {}

/**
 * @see https://seed-design.io/react/components/select
 */
export const SelectGroup = SeedSelect.Group;

export interface SelectGroupLabelProps extends SeedSelect.GroupLabelProps {}

/**
 * @see https://seed-design.io/react/components/select
 */
export const SelectGroupLabel = SeedSelect.GroupLabel;

export interface SelectItemProps extends Omit<SeedSelect.ItemProps, "children"> {
  prefixIcon?: React.ReactNode;

  label: React.ReactNode;

  description?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/select
 */
export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ prefixIcon, label, description, ...props }, ref) => {
    return (
      <SeedSelect.Item ref={ref} label={label} {...props}>
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedSelect.ItemBody>
          <SeedSelect.ItemLabel>{label}</SeedSelect.ItemLabel>
          {description && <SeedSelect.ItemDescription>{description}</SeedSelect.ItemDescription>}
        </SeedSelect.ItemBody>
        <SeedSelect.ItemIndicator selected={<IconCheckmarkFatFill />} />
      </SeedSelect.Item>
    );
  },
);
SelectItem.displayName = "SelectItem";

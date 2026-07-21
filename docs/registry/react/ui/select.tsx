"use client";

import {
  Field as SeedField,
  PrefixIcon,
  Select as SeedSelect,
  VisuallyHidden,
} from "@seed-design/react";
import type { FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";
import {
  IconCheckmarkFatFill,
  IconChevronDownSmallLine,
  IconExclamationmarkCircleFill,
} from "@karrotmarket/react-monochrome-icon";
import * as React from "react";

export interface SelectRootProps extends SeedSelect.RootProps {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: FieldLabelVariantProps["weight"];

  indicator?: React.ReactNode;
  showRequiredIndicator?: boolean;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;

  fieldRef?: React.Ref<HTMLDivElement>;
}

/**
 * @see https://seed-design.io/react/components/select
 */
export const SelectRoot = ({
  label,
  labelWeight,
  indicator,
  showRequiredIndicator,
  description,
  errorMessage,
  fieldRef,
  children,
  ...props
}: SelectRootProps) => {
  const renderHeader = label || indicator;
  const renderDescription = !!description;
  const renderErrorMessage = errorMessage && props.invalid;
  const renderFooter = renderDescription || renderErrorMessage;

  if (process.env.NODE_ENV !== "production" && !label) {
    console.warn(
      "SelectRoot: Provide a `label` prop for better accessibility. Please ignore this warning if you've provided `aria-label` or `aria-labelledby` to the `SelectTrigger` inside. This warning will not be shown in production builds.",
    );
  }

  return (
    <SeedField.Root
      required={props.required}
      disabled={props.disabled}
      invalid={props.invalid}
      readOnly={props.readOnly}
      name={props.name}
      ref={fieldRef}
    >
      {renderHeader && (
        <SeedField.Header>
          <SeedField.Label weight={labelWeight}>
            {label}
            {showRequiredIndicator && <SeedField.RequiredIndicator />}
            {indicator && <SeedField.IndicatorText>{indicator}</SeedField.IndicatorText>}
          </SeedField.Label>
          {/* You might want to put your custom element here */}
        </SeedField.Header>
      )}
      <SeedSelect.Root {...props}>
        {children}
        <SeedSelect.HiddenSelect />
      </SeedSelect.Root>
      {renderFooter && (
        <SeedField.Footer>
          {renderDescription &&
            (renderErrorMessage ? (
              <VisuallyHidden asChild>
                <SeedField.Description>{description}</SeedField.Description>
              </VisuallyHidden>
            ) : (
              <SeedField.Description>{description}</SeedField.Description>
            ))}
          {renderErrorMessage && (
            <SeedField.ErrorMessage>
              <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
              {errorMessage}
            </SeedField.ErrorMessage>
          )}
        </SeedField.Footer>
      )}
    </SeedField.Root>
  );
};

export interface SelectTriggerProps extends Omit<SeedSelect.TriggerProps, "children"> {
  placeholder?: React.ReactNode;

  prefixIcon?: React.ReactNode;

  /**
   * @default <IconChevronDownSmallLine />
   */
  suffixIcon?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/select
 */
export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ placeholder, prefixIcon, suffixIcon = <IconChevronDownSmallLine />, ...props }, ref) => {
    return (
      <SeedSelect.Trigger ref={ref} {...props}>
        <SeedSelect.PrefixIcon svg={prefixIcon} />
        <SeedSelect.Value />
        {placeholder && <SeedSelect.Placeholder>{placeholder}</SeedSelect.Placeholder>}
        <SeedSelect.SuffixIcon svg={suffixIcon} />
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
  label: React.ReactNode;

  description?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/select
 */
export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ label, description, ...props }, ref) => {
    return (
      <SeedSelect.Item ref={ref} label={label} {...props}>
        {props.prefixIcon && <PrefixIcon svg={props.prefixIcon} />}
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

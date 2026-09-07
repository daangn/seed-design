import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import IconChevronDownSmallLine from "@karrotmarket/lynx-monochrome-icon/IconChevronDownSmallLine";
import * as React from "@lynx-js/react";
import { Field as SeedField, Select as SeedSelect } from "@seed-design/lynx-react";
import type { LynxIconElementProps } from "@seed-design/lynx-react";

type FieldRootRef = React.ComponentRef<typeof SeedField.Root>;

export interface SelectRootProps extends SeedSelect.RootProps {
  label?: React.ReactNode;
  labelWeight?: SeedField.LabelProps["weight"];
  indicator?: React.ReactNode;
  showRequiredIndicator?: boolean;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  required?: boolean;
  fieldRef?: React.Ref<FieldRootRef>;
}

/**
 * @see https://seed-design.io/lynx/components/select
 */
export const SelectRoot = ({
  children,
  label,
  labelWeight,
  indicator,
  showRequiredIndicator,
  description,
  errorMessage,
  required,
  disabled,
  invalid,
  readOnly,
  fieldRef,
  ...rootProps
}: SelectRootProps) => {
  const renderHeader = label != null || indicator != null;
  const renderDescription = description != null && !(invalid && errorMessage != null);
  const renderErrorMessage = invalid && errorMessage != null;
  const renderFooter = renderDescription || renderErrorMessage;

  return (
    <SeedField.Root
      ref={fieldRef}
      required={required}
      disabled={disabled}
      invalid={invalid}
      readOnly={readOnly}
    >
      {renderHeader ? (
        <SeedField.Header>
          <SeedField.Label weight={labelWeight}>
            {label}
            {showRequiredIndicator ? <SeedField.RequiredIndicator /> : null}
            {indicator != null ? (
              <SeedField.IndicatorText>{indicator}</SeedField.IndicatorText>
            ) : null}
          </SeedField.Label>
        </SeedField.Header>
      ) : null}
      <SeedSelect.Root {...rootProps} disabled={disabled} invalid={invalid} readOnly={readOnly}>
        {children}
      </SeedSelect.Root>
      {renderFooter ? (
        <SeedField.Footer>
          {renderDescription ? <SeedField.Description>{description}</SeedField.Description> : null}
          {renderErrorMessage ? (
            <SeedField.ErrorMessage>{errorMessage}</SeedField.ErrorMessage>
          ) : null}
        </SeedField.Footer>
      ) : null}
    </SeedField.Root>
  );
};

export interface SelectTriggerProps extends Omit<SeedSelect.TriggerProps, "children"> {
  placeholder?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactElement<LynxIconElementProps>;
}

/**
 * @see https://seed-design.io/lynx/components/select
 */
export const SelectTrigger = React.forwardRef<unknown, SelectTriggerProps>((props, ref) => {
  const {
    placeholder,
    prefixIcon,
    suffixIcon = <IconChevronDownSmallLine />,
    ...triggerProps
  } = props;

  return (
    <SeedSelect.Trigger ref={ref} {...triggerProps}>
      <SeedSelect.PrefixIcon>{prefixIcon}</SeedSelect.PrefixIcon>
      <SeedSelect.Value />
      {placeholder != null ? <SeedSelect.Placeholder>{placeholder}</SeedSelect.Placeholder> : null}
      <SeedSelect.SuffixIcon>{suffixIcon}</SeedSelect.SuffixIcon>
    </SeedSelect.Trigger>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export interface SelectContentProps extends Omit<SeedSelect.ContentProps, "children"> {
  children?: React.ReactNode;
  positionerProps?: Omit<SeedSelect.PositionerProps, "children">;
}

/**
 * @see https://seed-design.io/lynx/components/select
 */
export function SelectContent(props: SelectContentProps) {
  const { children, positionerProps, ...contentProps } = props;

  return (
    <SeedSelect.Positioner {...positionerProps}>
      <SeedSelect.Content {...contentProps}>
        <SeedSelect.ScrollArea>{children}</SeedSelect.ScrollArea>
      </SeedSelect.Content>
    </SeedSelect.Positioner>
  );
}

export interface SelectGroupProps extends SeedSelect.GroupProps {
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/select
 */
export const SelectGroup = React.forwardRef<unknown, SelectGroupProps>((props, ref) => {
  const { label, children, ...groupProps } = props;

  return (
    <SeedSelect.Group ref={ref} {...groupProps}>
      {label != null ? <SeedSelect.GroupLabel>{label}</SeedSelect.GroupLabel> : null}
      {children}
    </SeedSelect.Group>
  );
});
SelectGroup.displayName = "SelectGroup";

export interface SelectItemProps extends Omit<SeedSelect.ItemProps, "children"> {
  description?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/select
 */
export const SelectItem = React.forwardRef<unknown, SelectItemProps>((props, ref) => {
  const { description, ...itemProps } = props;

  return (
    <SeedSelect.Item ref={ref} {...itemProps}>
      <SeedSelect.ItemPrefixIcon />
      <SeedSelect.ItemBody>
        <SeedSelect.ItemLabel />
        {description != null ? (
          <SeedSelect.ItemDescription>{description}</SeedSelect.ItemDescription>
        ) : null}
      </SeedSelect.ItemBody>
      <SeedSelect.ItemIndicator>
        <IconCheckmarkFatFill />
      </SeedSelect.ItemIndicator>
    </SeedSelect.Item>
  );
});
SelectItem.displayName = "SelectItem";

import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import * as React from "@lynx-js/react";
import {
  CheckSelectBox as SeedCheckSelectBox,
  PrefixIcon,
  RadioGroup as SeedRadioGroup,
  RadioGroupField as SeedRadioGroupField,
  RadioSelectBox as SeedRadioSelectBox,
} from "@seed-design/lynx-react";
import type { LynxIconElementProps } from "@seed-design/lynx-react";

export interface RadioSelectBoxRootProps extends SeedRadioGroupField.RootProps {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: SeedRadioGroupField.LabelProps["weight"];
  indicator?: React.ReactNode;
  showRequiredIndicator?: boolean;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;

  /**
   * Number of columns in the grid layout.
   * @default 1
   */
  columns?: SeedRadioSelectBox.GroupProps["columns"];
}

/**
 * @see https://seed-design.io/lynx/components/select-box
 */
export const RadioSelectBoxRoot = React.forwardRef<unknown, RadioSelectBoxRootProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      showRequiredIndicator,
      description,
      errorMessage,
      columns = 1,
      children,
      "accessibility-label": accessibilityLabel,
      ...props
    },
    ref,
  ) => {
    const renderHeader = label != null || indicator != null;
    const renderErrorMessage = props.invalid && errorMessage != null;
    const renderDescription = description != null && !renderErrorMessage;
    const renderFooter = renderDescription || renderErrorMessage;
    const defaultAccessibilityLabel = typeof label === "string" ? label : undefined;

    return (
      <SeedRadioGroupField.Root
        ref={ref}
        accessibility-label={accessibilityLabel ?? defaultAccessibilityLabel}
        {...props}
      >
        {renderHeader ? (
          <SeedRadioGroupField.Header>
            <SeedRadioGroupField.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator ? <SeedRadioGroupField.RequiredIndicator /> : null}
              {indicator != null ? (
                <SeedRadioGroupField.IndicatorText>{indicator}</SeedRadioGroupField.IndicatorText>
              ) : null}
            </SeedRadioGroupField.Label>
          </SeedRadioGroupField.Header>
        ) : null}
        <SeedRadioSelectBox.Group columns={columns}>{children}</SeedRadioSelectBox.Group>
        {renderFooter ? (
          <SeedRadioGroupField.Footer>
            {renderDescription ? (
              <SeedRadioGroupField.Description>{description}</SeedRadioGroupField.Description>
            ) : null}
            {renderErrorMessage ? (
              <SeedRadioGroupField.ErrorMessage>{errorMessage}</SeedRadioGroupField.ErrorMessage>
            ) : null}
          </SeedRadioGroupField.Footer>
        ) : null}
      </SeedRadioGroupField.Root>
    );
  },
);
RadioSelectBoxRoot.displayName = "RadioSelectBoxRoot";

export interface RadioSelectBoxItemProps extends Omit<SeedRadioSelectBox.ItemProps, "children"> {
  label: React.ReactNode;
  description?: React.ReactNode;
  prefixIcon?: React.ReactElement<LynxIconElementProps>;
  suffix?: React.ReactNode;
  footer?: React.ReactNode;
}

export const RadioSelectBoxItem = React.forwardRef<unknown, RadioSelectBoxItemProps>(
  (
    {
      label,
      description,
      prefixIcon,
      suffix,
      footer,
      "accessibility-label": accessibilityLabel,
      ...otherProps
    },
    ref,
  ) => {
    return (
      <SeedRadioSelectBox.Item
        ref={ref}
        accessibility-label={accessibilityLabel ?? (typeof label === "string" ? label : undefined)}
        {...otherProps}
      >
        <SeedRadioSelectBox.Trigger>
          <SeedRadioSelectBox.Content>
            {prefixIcon ? <PrefixIcon icon={prefixIcon} /> : null}
            <SeedRadioSelectBox.Body>
              <SeedRadioSelectBox.Label>{label}</SeedRadioSelectBox.Label>
              {description != null ? (
                <SeedRadioSelectBox.Description>{description}</SeedRadioSelectBox.Description>
              ) : null}
            </SeedRadioSelectBox.Body>
          </SeedRadioSelectBox.Content>
          {suffix}
        </SeedRadioSelectBox.Trigger>
        {footer != null ? <SeedRadioSelectBox.Footer>{footer}</SeedRadioSelectBox.Footer> : null}
      </SeedRadioSelectBox.Item>
    );
  },
);
RadioSelectBoxItem.displayName = "RadioSelectBoxItem";

export interface RadioSelectBoxRadiomarkProps extends SeedRadioGroup.ItemControlProps {}

export const RadioSelectBoxRadiomark = React.forwardRef<unknown, RadioSelectBoxRadiomarkProps>(
  (props, ref) => {
    return (
      <SeedRadioGroup.ItemControl ref={ref} tone="neutral" {...props}>
        <SeedRadioGroup.ItemIndicator />
      </SeedRadioGroup.ItemControl>
    );
  },
);
RadioSelectBoxRadiomark.displayName = "RadioSelectBoxRadiomark";

export interface CheckSelectBoxGroupProps extends SeedCheckSelectBox.GroupProps {}

export const CheckSelectBoxGroup = SeedCheckSelectBox.Group;

export interface CheckSelectBoxProps extends Omit<SeedCheckSelectBox.RootProps, "children"> {
  label: React.ReactNode;
  description?: React.ReactNode;
  prefixIcon?: React.ReactElement<LynxIconElementProps>;
  suffix?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/select-box
 */
export const CheckSelectBox = React.forwardRef<unknown, CheckSelectBoxProps>(
  (
    {
      label,
      description,
      prefixIcon,
      suffix,
      footer,
      "accessibility-label": accessibilityLabel,
      ...otherProps
    },
    ref,
  ) => {
    return (
      <SeedCheckSelectBox.Root
        ref={ref}
        accessibility-label={accessibilityLabel ?? (typeof label === "string" ? label : undefined)}
        {...otherProps}
      >
        <SeedCheckSelectBox.Trigger>
          <SeedCheckSelectBox.Content>
            {prefixIcon ? <PrefixIcon icon={prefixIcon} /> : null}
            <SeedCheckSelectBox.Body>
              <SeedCheckSelectBox.Label>{label}</SeedCheckSelectBox.Label>
              {description != null ? (
                <SeedCheckSelectBox.Description>{description}</SeedCheckSelectBox.Description>
              ) : null}
            </SeedCheckSelectBox.Body>
          </SeedCheckSelectBox.Content>
          {suffix}
        </SeedCheckSelectBox.Trigger>
        {footer != null ? <SeedCheckSelectBox.Footer>{footer}</SeedCheckSelectBox.Footer> : null}
      </SeedCheckSelectBox.Root>
    );
  },
);
CheckSelectBox.displayName = "CheckSelectBox";

export interface CheckSelectBoxCheckmarkProps extends SeedCheckSelectBox.CheckmarkControlProps {}

export const CheckSelectBoxCheckmark = React.forwardRef<unknown, CheckSelectBoxCheckmarkProps>(
  (props, ref) => {
    return (
      <SeedCheckSelectBox.CheckmarkControl ref={ref} {...props}>
        <SeedCheckSelectBox.CheckmarkIcon icon={<IconCheckmarkFatFill />} />
      </SeedCheckSelectBox.CheckmarkControl>
    );
  },
);
CheckSelectBoxCheckmark.displayName = "CheckSelectBoxCheckmark";

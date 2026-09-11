import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import IconChevronDownSmallLine from "@karrotmarket/lynx-monochrome-icon/IconChevronDownSmallLine";
import * as React from "@lynx-js/react";
import { Field as SeedField, Select as SeedSelect } from "@seed-design/lynx-react";
import type { LynxAccessibilityProps, LynxIconElementProps } from "@seed-design/lynx-react";

type FieldRootRef = React.ComponentRef<typeof SeedField.Root>;

const SelectAccessibilityLabelContext =
  React.createContext<LynxAccessibilityProps["accessibility-label"]>(undefined);

export interface SelectRootProps
  extends SeedSelect.RootProps,
    Pick<SeedField.RootProps, "required" | "invalid" | "readOnly"> {
  label?: React.ReactNode;
  labelWeight?: SeedField.LabelProps["weight"];
  indicator?: React.ReactNode;
  showRequiredIndicator?: boolean;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  fieldRef?: React.Ref<FieldRootRef>;
  "accessibility-label"?: LynxAccessibilityProps["accessibility-label"];
}

/**
 * Field와 Select의 값·열림 상태를 함께 조합합니다. label이 문자열이 아니면
 * `accessibility-label`을 `SelectRoot` 또는 `SelectTrigger`에 지정하세요.
 *
 * @see https://seed-design.io/lynx/components/select
 */
export const SelectRoot = React.forwardRef<FieldRootRef, SelectRootProps>(
  (
    {
      children,
      label,
      labelWeight,
      indicator,
      showRequiredIndicator,
      description,
      errorMessage,
      fieldRef,
      "accessibility-label": accessibilityLabel,
      value,
      defaultValue,
      onValueChange,
      multiple,
      open,
      defaultOpen,
      onOpenChange,
      disabled,
      required,
      invalid,
      readOnly,
      size,
      placement,
      gutter,
      overflowPadding,
      formatValue,
      ...fieldProps
    },
    ref,
  ) => {
    const renderHeader = label != null || indicator != null;
    const renderErrorMessage = invalid && errorMessage != null;
    const renderDescription = description != null && !renderErrorMessage;
    const renderFooter = renderDescription || renderErrorMessage;
    const defaultAccessibilityLabel = typeof label === "string" ? label : undefined;
    const resolvedAccessibilityLabel = accessibilityLabel ?? defaultAccessibilityLabel;

    return (
      <SeedField.Root
        ref={fieldRef ?? ref}
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        {...fieldProps}
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
        <SeedSelect.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          multiple={multiple}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          disabled={disabled}
          required={required}
          invalid={invalid}
          readOnly={readOnly}
          size={size}
          placement={placement}
          gutter={gutter}
          overflowPadding={overflowPadding}
          formatValue={formatValue}
        >
          <SelectAccessibilityLabelContext.Provider value={resolvedAccessibilityLabel}>
            {children}
          </SelectAccessibilityLabelContext.Provider>
        </SeedSelect.Root>
        {renderFooter ? (
          <SeedField.Footer>
            {renderDescription ? (
              <SeedField.Description>{description}</SeedField.Description>
            ) : null}
            {renderErrorMessage ? (
              <SeedField.ErrorMessage>{errorMessage}</SeedField.ErrorMessage>
            ) : null}
          </SeedField.Footer>
        ) : null}
      </SeedField.Root>
    );
  },
);
SelectRoot.displayName = "SelectRoot";

export interface SelectTriggerProps extends Omit<SeedSelect.TriggerProps, "children"> {
  placeholder?: React.ReactNode;
  prefixIcon?: React.ReactElement<LynxIconElementProps>;
  suffixIcon?: React.ReactElement<LynxIconElementProps>;
}

/**
 * 선택 값 또는 placeholder를 표시하고 탭으로 목록을 열고 닫습니다.
 *
 * @see https://seed-design.io/lynx/components/select
 */
export const SelectTrigger = React.forwardRef<unknown, SelectTriggerProps>(
  (
    {
      placeholder,
      prefixIcon,
      suffixIcon = <IconChevronDownSmallLine />,
      "accessibility-label": accessibilityLabel,
      ...props
    },
    ref,
  ) => {
    const rootAccessibilityLabel = React.useContext(SelectAccessibilityLabelContext);

    return (
      <SeedSelect.Trigger
        ref={ref}
        accessibility-label={accessibilityLabel ?? rootAccessibilityLabel}
        {...props}
      >
        <SeedSelect.PrefixIcon fallback={prefixIcon} />
        <SeedSelect.Value />
        {placeholder != null ? (
          <SeedSelect.Placeholder>{placeholder}</SeedSelect.Placeholder>
        ) : null}
        <SeedSelect.SuffixIcon icon={suffixIcon} />
      </SeedSelect.Trigger>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectContentProps extends SeedSelect.ContentProps {}

/**
 * Native overlay, 위치 계산, 표시 수명과 긴 목록의 scroll viewport를 함께 구성합니다.
 * 자식에 별도 Positioner나 ScrollArea를 추가하지 마세요.
 *
 * @see https://seed-design.io/lynx/components/select
 */
export const SelectContent = SeedSelect.Content;

export interface SelectGroupProps extends SeedSelect.GroupProps {
  label?: React.ReactNode;
}

export const SelectGroup = React.forwardRef<unknown, SelectGroupProps>(
  ({ label, children, ...props }, ref) => {
    return (
      <SeedSelect.Group ref={ref} {...props}>
        {label != null ? <SeedSelect.GroupLabel>{label}</SeedSelect.GroupLabel> : null}
        {children}
      </SeedSelect.Group>
    );
  },
);
SelectGroup.displayName = "SelectGroup";

export interface SelectItemProps extends Omit<SeedSelect.ItemProps, "children"> {
  label: React.ReactNode;
  description?: React.ReactNode;
  selectedIndicator?: React.ReactNode;
  prefixIcon?: React.ReactElement<LynxIconElementProps>;
}

/**
 * item body, 설명, prefix icon과 선택 indicator를 조합합니다. `selectedIndicator`로
 * 기본 checkmark를 바꿀 수 있습니다.
 *
 * @see https://seed-design.io/lynx/components/select
 */
export const SelectItem = React.forwardRef<unknown, SelectItemProps>(
  (
    {
      label,
      description,
      selectedIndicator = <IconCheckmarkFatFill />,
      prefixIcon,
      "accessibility-label": accessibilityLabel,
      ...props
    },
    ref,
  ) => {
    return (
      <SeedSelect.Item
        ref={ref}
        accessibility-label={accessibilityLabel ?? (typeof label === "string" ? label : undefined)}
        prefixIcon={prefixIcon}
        label={label}
        {...props}
      >
        <SeedSelect.ItemPrefixIcon />
        <SeedSelect.ItemBody>
          <SeedSelect.ItemLabel>{label}</SeedSelect.ItemLabel>
          {description != null ? (
            <SeedSelect.ItemDescription>{description}</SeedSelect.ItemDescription>
          ) : null}
        </SeedSelect.ItemBody>
        <SeedSelect.ItemIndicator selected={selectedIndicator} />
      </SeedSelect.Item>
    );
  },
);
SelectItem.displayName = "SelectItem";

"use client";

import * as React from "react";
import {
  SegmentedTextInput as SeedSegmentedTextInput,
  Field as SeedField,
  VisuallyHidden,
  PrefixIcon,
} from "@seed-design/react";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";

const SEGMENT_LABELS = [
  "카드번호 1-4번째 자리",
  "카드번호 5-8번째 자리",
  "카드번호 9-12번째 자리",
  "카드번호 13-16번째 자리",
];

export interface CardNumberInputProps
  extends Omit<SeedSegmentedTextInput.RootProps, "children" | "asChild"> {
  /**
   * 가려서 입력받을 뒷자리 수. 가린 Segment는 붙여넣기·자동완성으로 채우지 않습니다.
   * @default 8
   */
  maskedDigits?: 4 | 8;
  /**
   * 입력 끝에 표시할 요소. 카드사 로고 등을 넣습니다.
   */
  suffix?: React.ReactNode;
}

/**
 * 4자리씩 네 Segment로 카드번호를 입력받습니다. 값은 `string[]`(4개)입니다.
 */
export const CardNumberInput = React.forwardRef<HTMLDivElement, CardNumberInputProps>(
  ({ maskedDigits = 8, suffix, ...otherProps }, ref) => {
    const maskedFrom = SEGMENT_LABELS.length - maskedDigits / 4;

    return (
      <SeedSegmentedTextInput.Root ref={ref} {...otherProps}>
        {SEGMENT_LABELS.map((label, i) => {
          const masked = i >= maskedFrom;

          return (
            <React.Fragment key={label}>
              {i > 0 && <SeedSegmentedTextInput.Separator> - </SeedSegmentedTextInput.Separator>}
              <SeedSegmentedTextInput.Segment
                aria-label={label}
                placeholder={masked ? "••••" : "0000"}
                length={4}
                masked={masked}
                autoComplete={i === 0 ? "cc-number" : masked ? "off" : undefined}
              />
            </React.Fragment>
          );
        })}
        {suffix && <SeedSegmentedTextInput.Suffix>{suffix}</SeedSegmentedTextInput.Suffix>}
      </SeedSegmentedTextInput.Root>
    );
  },
);
CardNumberInput.displayName = "CardNumberInput";

export interface CardNumberFieldProps extends CardNumberInputProps {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: SeedField.LabelProps["weight"];

  indicator?: React.ReactNode;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;

  showRequiredIndicator?: boolean;

  fieldRef?: React.Ref<HTMLDivElement>;
}

/**
 * @see https://seed-design.io/react/components/segmented-text-input
 */
export const CardNumberField = React.forwardRef<HTMLDivElement, CardNumberFieldProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      description,
      errorMessage,

      // field props
      required,
      disabled,
      invalid,
      readOnly,

      showRequiredIndicator,

      fieldRef,

      ...otherProps
    },
    ref,
  ) => {
    const renderHeader = label || indicator;
    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && invalid;
    const renderFooter = renderDescription || renderErrorMessage;

    if (process.env.NODE_ENV !== "production" && !label) {
      console.warn(
        "CardNumberField: Provide a `label` prop for better accessibility. Please ignore this warning if you've provided `aria-label` or `aria-labelledby`. This warning will not be shown in production builds.",
      );
    }

    return (
      <SeedField.Root
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        ref={fieldRef}
      >
        {renderHeader && (
          <SeedField.Header>
            <SeedField.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator && <SeedField.RequiredIndicator />}
              {indicator && <SeedField.IndicatorText>{indicator}</SeedField.IndicatorText>}
            </SeedField.Label>
          </SeedField.Header>
        )}
        <CardNumberInput ref={ref} {...otherProps} />
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
  },
);
CardNumberField.displayName = "CardNumberField";

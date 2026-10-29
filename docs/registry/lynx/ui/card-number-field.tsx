import * as React from "@lynx-js/react";
import {
  Field as SeedField,
  SegmentedTextInput as SeedSegmentedTextInput,
} from "@seed-design/lynx-react";

type SegmentedTextInputRootRef = React.ComponentRef<typeof SeedSegmentedTextInput.Root>;
type FieldRootRef = React.ComponentRef<typeof SeedField.Root>;

const SEGMENT_LABELS = [
  "카드번호 1-4번째 자리",
  "카드번호 5-8번째 자리",
  "카드번호 9-12번째 자리",
  "카드번호 13-16번째 자리",
];

export interface CardNumberInputProps extends Omit<SeedSegmentedTextInput.RootProps, "children"> {
  /**
   * 가려서 입력받을 뒷자리 수. 가린 Segment는 붙여넣기로 채우지 않습니다.
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
export const CardNumberInput = React.forwardRef<SegmentedTextInputRootRef, CardNumberInputProps>(
  ({ maskedDigits = 8, suffix, ...otherProps }, ref) => {
    const maskedFrom = SEGMENT_LABELS.length - maskedDigits / 4;

    return (
      <SeedSegmentedTextInput.Root ref={ref} {...otherProps}>
        {SEGMENT_LABELS.map((label, i) => {
          const masked = i >= maskedFrom;

          return (
            <React.Fragment key={label}>
              {i > 0 ? (
                <SeedSegmentedTextInput.Separator> - </SeedSegmentedTextInput.Separator>
              ) : null}
              <SeedSegmentedTextInput.Segment
                accessibility-label={label}
                placeholder={masked ? undefined : "0000"}
                length={4}
                masked={masked}
              />
            </React.Fragment>
          );
        })}
        {suffix != null ? (
          <SeedSegmentedTextInput.Suffix>{suffix}</SeedSegmentedTextInput.Suffix>
        ) : null}
      </SeedSegmentedTextInput.Root>
    );
  },
);
CardNumberInput.displayName = "CardNumberInput";

export interface CardNumberFieldProps extends CardNumberInputProps {
  label?: React.ReactNode;
  labelWeight?: SeedField.LabelProps["weight"];
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showRequiredIndicator?: boolean;
  fieldRef?: React.Ref<FieldRootRef>;
}

/**
 * @see https://seed-design.io/lynx/components/segmented-text-input
 */
export const CardNumberField = React.forwardRef<SegmentedTextInputRootRef, CardNumberFieldProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      description,
      errorMessage,
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
        <CardNumberInput ref={ref} {...otherProps} />
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
CardNumberField.displayName = "CardNumberField";

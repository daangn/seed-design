import * as React from "@lynx-js/react";
import {
  Field as SeedField,
  SegmentedTextInput as SeedSegmentedTextInput,
} from "@seed-design/lynx-react";

type SegmentedTextInputRootRef = React.ComponentRef<typeof SeedSegmentedTextInput.Root>;
type FieldRootRef = React.ComponentRef<typeof SeedField.Root>;

export interface ResidentNumberInputProps
  extends Omit<SeedSegmentedTextInput.RootProps, "children"> {
  /**
   * 입력받을 자리 수.
   * - `6`: 생년월일 6자리만 입력받고 뒷자리는 불릿으로 표시합니다.
   * - `7`: 생년월일 6자리와 뒷자리 첫 번째 자리를 입력받습니다.
   * - `13`: 생년월일 6자리와 뒷자리 7자리를 입력받습니다. 뒷자리는 가려서 표시합니다.
   * @default 7
   */
  digits?: 6 | 7 | 13;
}

/**
 * 값은 입력 Segment 순서대로 `string[]`입니다. `digits=6`이면 `[생년월일]`, 그 밖에는 `[생년월일, 뒷자리]`입니다.
 */
export const ResidentNumberInput = React.forwardRef<
  SegmentedTextInputRootRef,
  ResidentNumberInputProps
>(({ digits = 7, ...otherProps }, ref) => {
  return (
    <SeedSegmentedTextInput.Root ref={ref} {...otherProps}>
      <SeedSegmentedTextInput.Segment
        accessibility-label="생년월일 6자리"
        placeholder="생년월일 6자리"
        length={6}
        autoComplete="bday"
        sizing="fill"
      />
      <SeedSegmentedTextInput.Separator> - </SeedSegmentedTextInput.Separator>
      {digits === 6 ? (
        <SeedSegmentedTextInput.Segment staticText="•••••••" sizing="fill" align="center" />
      ) : null}
      {digits === 7 ? (
        <SeedSegmentedTextInput.Segment
          accessibility-label="주민등록번호 뒷자리 첫 번째 자리"
          placeholder="•"
          length={1}
          staticSuffix="••••••"
          sizing="fill"
          align="center"
        />
      ) : null}
      {digits === 13 ? (
        <SeedSegmentedTextInput.Segment
          accessibility-label="주민등록번호 뒷자리 7자리"
          placeholder="•••••••"
          length={7}
          masked
          sizing="fill"
          align="center"
        />
      ) : null}
    </SeedSegmentedTextInput.Root>
  );
});
ResidentNumberInput.displayName = "ResidentNumberInput";

export interface ResidentNumberFieldProps extends ResidentNumberInputProps {
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
export const ResidentNumberField = React.forwardRef<
  SegmentedTextInputRootRef,
  ResidentNumberFieldProps
>(
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
        <ResidentNumberInput ref={ref} {...otherProps} />
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
ResidentNumberField.displayName = "ResidentNumberField";

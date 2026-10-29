"use client";

import * as React from "react";
import {
  SegmentedTextInput as SeedSegmentedTextInput,
  Field as SeedField,
  VisuallyHidden,
  PrefixIcon,
} from "@seed-design/react";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";

export interface ResidentNumberInputProps
  extends Omit<SeedSegmentedTextInput.RootProps, "children" | "asChild"> {
  /**
   * 입력받을 자리 수.
   * - `6`: 생년월일 6자리만 입력받고 뒷자리는 점으로 표시합니다.
   * - `7`: 생년월일 6자리와 뒷자리 첫 번째 자리를 입력받습니다.
   * - `13`: 생년월일 6자리와 뒷자리 7자리를 입력받습니다. 뒷자리는 가려서 표시합니다.
   * @default 7
   */
  digits?: 6 | 7 | 13;
}

/**
 * 값은 입력 Segment 순서대로 `string[]`입니다. `digits=6`이면 `[생년월일]`, 그 밖에는 `[생년월일, 뒷자리]`입니다.
 */
export const ResidentNumberInput = React.forwardRef<HTMLDivElement, ResidentNumberInputProps>(
  ({ digits = 7, ...otherProps }, ref) => {
    return (
      <SeedSegmentedTextInput.Root ref={ref} {...otherProps}>
        <SeedSegmentedTextInput.Segment
          aria-label="생년월일 6자리"
          placeholder="생년월일 6자리"
          length={6}
          autoComplete="bday"
          sizing="fill"
        />
        <SeedSegmentedTextInput.Separator> - </SeedSegmentedTextInput.Separator>
        {digits === 6 && (
          <SeedSegmentedTextInput.Segment
            staticText={<SeedSegmentedTextInput.Dots count={7} />}
            sizing="fill"
            align="center"
          />
        )}
        {digits === 7 && (
          <SeedSegmentedTextInput.Segment
            aria-label="주민등록번호 뒷자리 첫 번째 자리"
            placeholder={<SeedSegmentedTextInput.Dots count={1} />}
            length={1}
            staticSuffix={<SeedSegmentedTextInput.Dots count={6} />}
            sizing="fill"
            align="center"
          />
        )}
        {digits === 13 && (
          <SeedSegmentedTextInput.Segment
            aria-label="주민등록번호 뒷자리 7자리"
            length={7}
            masked
            sizing="fill"
            align="center"
          />
        )}
      </SeedSegmentedTextInput.Root>
    );
  },
);
ResidentNumberInput.displayName = "ResidentNumberInput";

export interface ResidentNumberFieldProps extends ResidentNumberInputProps {
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
export const ResidentNumberField = React.forwardRef<HTMLDivElement, ResidentNumberFieldProps>(
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
        "ResidentNumberField: Provide a `label` prop for better accessibility. Please ignore this warning if you've provided `aria-label` or `aria-labelledby`. This warning will not be shown in production builds.",
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
        <ResidentNumberInput ref={ref} {...otherProps} />
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
ResidentNumberField.displayName = "ResidentNumberField";

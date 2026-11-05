// Note for AI Agents: Only the shipped formats (ResidentNumberField, CardNumberField) are supported; if you need to compose SegmentedTextField or SegmentedTextInput into any other format, stop and tell the user before writing code.
"use client";

import * as React from "react";
import {
  SegmentedTextField,
  SegmentedTextFieldSegment,
  SegmentedTextFieldSeparator,
  SegmentedTextFieldSuffix,
  type SegmentedTextFieldProps,
} from "./segmented-text-field";

const SEGMENT_LABELS = [
  "카드번호 1-4번째 자리",
  "카드번호 5-8번째 자리",
  "카드번호 9-12번째 자리",
  "카드번호 13-16번째 자리",
];

export interface CardNumberFieldProps extends Omit<SegmentedTextFieldProps, "children"> {
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
 *
 * @see https://seed-design.io/react/components/segmented-text-input
 */
export const CardNumberField = React.forwardRef<HTMLDivElement, CardNumberFieldProps>(
  ({ maskedDigits = 8, suffix, ...otherProps }, ref) => {
    const maskedFrom = SEGMENT_LABELS.length - maskedDigits / 4;

    return (
      <SegmentedTextField ref={ref} {...otherProps}>
        {SEGMENT_LABELS.map((label, i) => {
          const masked = i >= maskedFrom;

          return (
            <React.Fragment key={label}>
              {i > 0 && <SegmentedTextFieldSeparator> - </SegmentedTextFieldSeparator>}
              <SegmentedTextFieldSegment
                aria-label={label}
                placeholder={masked ? undefined : "0000"}
                length={4}
                masked={masked}
                autoComplete={i === 0 ? "cc-number" : masked ? "off" : undefined}
              />
            </React.Fragment>
          );
        })}
        {suffix && <SegmentedTextFieldSuffix>{suffix}</SegmentedTextFieldSuffix>}
      </SegmentedTextField>
    );
  },
);
CardNumberField.displayName = "CardNumberField";

// Note for AI Agents: Only the shipped formats (ResidentNumberField, CardNumberField) are supported; if you need to compose SegmentedTextField or SegmentedTextInput into any other format, stop and tell the user before writing code.
"use client";

import * as React from "react";
import {
  SegmentedTextField,
  SegmentedTextFieldDots,
  SegmentedTextFieldSegment,
  SegmentedTextFieldSeparator,
  type SegmentedTextFieldProps,
} from "./segmented-text-field";

export interface ResidentNumberFieldProps extends Omit<SegmentedTextFieldProps, "children"> {
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
 *
 * @see https://seed-design.io/react/components/segmented-text-input
 */
export const ResidentNumberField = React.forwardRef<HTMLDivElement, ResidentNumberFieldProps>(
  ({ digits = 7, ...otherProps }, ref) => {
    return (
      <SegmentedTextField ref={ref} {...otherProps}>
        <SegmentedTextFieldSegment
          aria-label="생년월일 6자리"
          placeholder="생년월일 6자리"
          length={6}
          autoComplete="bday"
          sizing="fill"
        />
        <SegmentedTextFieldSeparator> - </SegmentedTextFieldSeparator>
        {digits === 6 && (
          <SegmentedTextFieldSegment
            staticText={<SegmentedTextFieldDots count={7} />}
            sizing="fill"
            align="center"
          />
        )}
        {digits === 7 && (
          <SegmentedTextFieldSegment
            aria-label="주민등록번호 뒷자리 첫 번째 자리"
            placeholder={<SegmentedTextFieldDots count={1} />}
            length={1}
            staticSuffix={<SegmentedTextFieldDots count={6} />}
            sizing="fill"
            align="center"
          />
        )}
        {digits === 13 && (
          <SegmentedTextFieldSegment
            aria-label="주민등록번호 뒷자리 7자리"
            length={7}
            masked
            sizing="fill"
            align="center"
          />
        )}
      </SegmentedTextField>
    );
  },
);
ResidentNumberField.displayName = "ResidentNumberField";

"use client";

import { WheelPicker as SeedWheelPicker } from "@seed-design/react";
import * as React from "react";

export interface WheelPickerOption {
  /** 항목을 식별하고 선택 상태로 주고받는 고유 값입니다. */
  value: string;

  /** 항목에 표시할 내용입니다. */
  label: React.ReactNode;

  /** React 요소 label을 스크린 리더에서 읽을 문자열입니다. */
  ariaLabel?: string;
}

export interface WheelPickerColumn
  extends Omit<SeedWheelPicker.ColumnProps, "options"> {
  /** 컬럼을 식별하는 고유 값입니다. */
  id: string;

  /** 컬럼에 표시할 선택 항목입니다. 하나 이상의 항목을 제공해야 합니다. */
  options: readonly WheelPickerOption[];
}

export interface WheelPickerProps extends Omit<SeedWheelPicker.RootProps, "children"> {
  /** Wheel Picker를 구성하는 컬럼 목록입니다. */
  columns: readonly WheelPickerColumn[];
}

function validateOptionLabels(columns: readonly WheelPickerColumn[]) {
  if (process.env.NODE_ENV === "production") return;

  for (const column of columns) {
    for (const option of column.options) {
      if (React.isValidElement(option.label) && !option.ariaLabel) {
        console.warn(
          `WheelPicker: "${column.id}" 컬럼에서 React 요소 label을 사용하는 option에는 ariaLabel이 필요합니다.`,
        );
      }
    }
  }
}

/**
 * 여러 Wheel Picker 컬럼을 데이터 배열로 구성합니다.
 *
 * @see https://seed-design.io/react/components/wheel-picker
 */
export const WheelPicker = React.forwardRef<HTMLDivElement, WheelPickerProps>(
  ({ columns, ...rootProps }, ref) => {
    validateOptionLabels(columns);

    return (
      <SeedWheelPicker.Root ref={ref} {...rootProps}>
        {columns.map(({ id, options, ...columnProps }) => (
          <SeedWheelPicker.Column key={id} options={options} {...columnProps} />
        ))}
      </SeedWheelPicker.Root>
    );
  },
);
WheelPicker.displayName = "WheelPicker";

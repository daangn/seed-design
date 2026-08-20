import { WheelPicker as SeedWheelPicker } from "@seed-design/react";
import * as React from "react";

export interface WheelPickerOption {
  value: string;
  label: React.ReactNode;
  /** React 요소 label을 스크린 리더에서 읽을 문자열입니다. */
  ariaLabel?: string;
}

export interface WheelPickerColumn
  extends Omit<SeedWheelPicker.ColumnProps, "getAriaValueText" | "options"> {
  id: string;
  options: readonly WheelPickerOption[];
}

export interface WheelPickerProps extends Omit<SeedWheelPicker.RootProps, "children"> {
  columns: readonly WheelPickerColumn[];
}

function getAriaValueText(options: readonly WheelPickerOption[], value: string) {
  const option = options.find((item) => item.value === value);

  if (!option) return value;
  if (option.ariaLabel) return option.ariaLabel;
  if (typeof option.label === "string") return option.label;
  return value;
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
          <SeedWheelPicker.Column
            key={id}
            options={options}
            getAriaValueText={(value) => getAriaValueText(options, value)}
            {...columnProps}
          />
        ))}
      </SeedWheelPicker.Root>
    );
  },
);
WheelPicker.displayName = "WheelPicker";

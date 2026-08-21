"use client";

import type {
  WheelPickerColumnProps as HeadlessWheelPickerColumnProps,
  WheelPickerOption,
  WheelPickerRootProps as HeadlessWheelPickerRootProps,
} from "@seed-design/react-wheel-picker";
import * as React from "react";
import { InternalWheelPickerColumn, InternalWheelPickerRoot } from "../private/WheelPicker";

const DEFAULT_ITEM_SIZE = 44;
const DEFAULT_VISIBLE_ITEM_COUNT = 5;

export interface WheelPickerRootProps
  extends Omit<
    HeadlessWheelPickerRootProps,
    "asChild" | "children" | "disabled" | "itemSize" | "readOnly" | "visibleItemCount"
  > {
  /** Wheel Picker를 구성하는 `WheelPicker.Column` 목록입니다. */
  children: React.ReactNode;

  /** 모든 컬럼의 포커스와 값 변경을 막습니다. */
  disabled?: boolean;

  /**
   * 한 항목의 높이입니다.
   * @default 44
   */
  itemSize?: number;

  /**
   * 화면에 보이는 항목 수입니다. 0보다 큰 홀수여야 합니다.
   * @default 5
   */
  visibleItemCount?: number;
}

export const WheelPickerRoot = React.forwardRef<HTMLDivElement, WheelPickerRootProps>(
  (
    { itemSize = DEFAULT_ITEM_SIZE, visibleItemCount = DEFAULT_VISIBLE_ITEM_COUNT, ...props },
    ref,
  ) => (
    <InternalWheelPickerRoot
      ref={ref}
      {...props}
      appearance="neutral"
      itemSize={itemSize}
      visibleItemCount={visibleItemCount}
      readOnly={false}
    />
  ),
);
WheelPickerRoot.displayName = "WheelPickerRoot";

export interface WheelPickerColumnProps
  extends Omit<
    HeadlessWheelPickerColumnProps,
    | "asChild"
    | "defaultValue"
    | "getAriaValueText"
    | "loop"
    | "onValueChange"
    | "options"
    | "renderOption"
    | "value"
    | "valueChangeBehavior"
  > {
  /** 컬럼에 표시할 선택 항목입니다. 하나 이상의 항목을 제공해야 합니다. */
  options: readonly WheelPickerOption[];

  /** 제어 상태에서 현재 선택된 항목의 값입니다. */
  value?: string;

  /** 비제어 상태에서 처음 선택할 항목의 값입니다. */
  defaultValue?: string;

  /** 선택 값이 바뀔 때 호출됩니다. */
  onValueChange?: HeadlessWheelPickerColumnProps["onValueChange"];

  /**
   * 마지막 항목과 첫 항목을 이어 반복해서 탐색할지 여부입니다.
   * @default false
   */
  loop?: boolean;

  /**
   * 외부에서 `value`가 변경되었을 때 새 값으로 이동하는 스크롤 방식입니다.
   * @default "auto"
   */
  valueChangeBehavior?: ScrollBehavior;

  /** 현재 값에 대응하는 접근성 텍스트를 반환합니다. */
  getAriaValueText?: (value: string) => string;
}

export const WheelPickerColumn = React.forwardRef<HTMLDivElement, WheelPickerColumnProps>(
  (props, ref) => <InternalWheelPickerColumn ref={ref} appearance="neutral" {...props} />,
);
WheelPickerColumn.displayName = "WheelPickerColumn";

export type { WheelPickerOption };

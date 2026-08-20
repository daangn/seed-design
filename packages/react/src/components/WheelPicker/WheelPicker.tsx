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
  extends Omit<HeadlessWheelPickerRootProps, "asChild" | "itemSize" | "visibleItemCount"> {
  children: React.ReactNode;

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
      appearance="neutral"
      itemSize={itemSize}
      visibleItemCount={visibleItemCount}
      {...props}
    />
  ),
);
WheelPickerRoot.displayName = "WheelPickerRoot";

export interface WheelPickerColumnProps
  extends Omit<HeadlessWheelPickerColumnProps, "asChild" | "renderOption"> {}

export const WheelPickerColumn = React.forwardRef<HTMLDivElement, WheelPickerColumnProps>(
  (props, ref) => <InternalWheelPickerColumn ref={ref} appearance="neutral" {...props} />,
);
WheelPickerColumn.displayName = "WheelPickerColumn";

export type { WheelPickerOption };

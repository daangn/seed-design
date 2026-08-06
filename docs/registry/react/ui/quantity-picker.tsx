"use client";

import { IconMinusLine, IconPlusLine, IconTrashcanLine } from "@karrotmarket/react-monochrome-icon";
import { QuantityPicker as SeedQuantityPicker } from "@seed-design/react";
import * as React from "react";
import { ProgressCircle } from "./progress-circle";

export interface QuantityPickerProps
  extends Omit<SeedQuantityPicker.RootProps, "children" | "removeAriaLabel"> {
  /**
   * Remove 버튼의 접근성 이름입니다.
   * @default "상품 삭제"
   */
  removeAriaLabel?: SeedQuantityPicker.RootProps["removeAriaLabel"];

  /**
   * Decrement 버튼의 접근성 이름입니다.
   * @default "수량 줄이기"
   */
  decrementAriaLabel?: string;
  /**
   * Increment 버튼의 접근성 이름입니다.
   * @default "수량 늘리기"
   */
  incrementAriaLabel?: string;

  /**
   * Decrement 버튼에 표시할 아이콘입니다.
   * @default <IconMinusLine />
   */
  decrementIcon?: React.ReactNode;
  /**
   * Increment 버튼에 표시할 아이콘입니다.
   * @default <IconPlusLine />
   */
  incrementIcon?: React.ReactNode;
  /**
   * Remove 버튼에 표시할 아이콘입니다.
   * @default <IconTrashcanLine />
   */
  removeIcon?: React.ReactNode;
  /**
   * loading 상태일 때 버튼에 표시할 요소입니다.
   * @default <ProgressCircle size="inherit" tone="inherit" />
   */
  loadingIndicator?: React.ReactNode;

  /** 현재 수량을 form으로 제출할 때 hidden input에 전달할 속성입니다. */
  inputProps?: SeedQuantityPicker.HiddenInputProps;
}

/**
 * @see https://seed-design.io/react/components/quantity-picker
 */
export const QuantityPicker = React.forwardRef<
  React.ElementRef<typeof SeedQuantityPicker.Root>,
  QuantityPickerProps
>(
  (
    {
      decrementAriaLabel = "수량 줄이기",
      incrementAriaLabel = "수량 늘리기",
      removeAriaLabel = "상품 삭제",
      decrementIcon = <IconMinusLine />,
      incrementIcon = <IconPlusLine />,
      removeIcon = <IconTrashcanLine />,
      loadingIndicator = <ProgressCircle size="inherit" tone="inherit" />,
      inputProps,
      ...rootProps
    },
    ref,
  ) => {
    return (
      <SeedQuantityPicker.Root ref={ref} removeAriaLabel={removeAriaLabel} {...rootProps}>
        <SeedQuantityPicker.DecrementButton
          aria-label={decrementAriaLabel}
          icon={decrementIcon}
          loadingIndicator={loadingIndicator}
          removeIcon={removeIcon}
        />
        <SeedQuantityPicker.ValueDisplay />
        <SeedQuantityPicker.IncrementButton
          aria-label={incrementAriaLabel}
          icon={incrementIcon}
          loadingIndicator={loadingIndicator}
        />
        <SeedQuantityPicker.HiddenInput {...inputProps} />
      </SeedQuantityPicker.Root>
    );
  },
);
QuantityPicker.displayName = "QuantityPicker";

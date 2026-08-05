"use client";

import { IconMinusLine, IconPlusLine, IconTrashcanLine } from "@karrotmarket/react-monochrome-icon";
import { QuantityPicker as SeedQuantityPicker } from "@seed-design/react";
import * as React from "react";
import { ProgressCircle } from "./progress-circle";

export interface QuantityPickerProps extends Omit<SeedQuantityPicker.RootProps, "children"> {
  /** 제어 상태에서 현재 수량을 지정합니다. */
  value?: SeedQuantityPicker.RootProps["value"];
  /** 비제어 상태에서 초기 수량을 지정합니다. 지정하지 않으면 `min`을 사용합니다. */
  defaultValue?: SeedQuantityPicker.RootProps["defaultValue"];
  /** 수량이 변경될 때 호출됩니다. */
  onValueChange?: SeedQuantityPicker.RootProps["onValueChange"];

  /** 선택할 수 있는 최소 수량입니다. */
  min: SeedQuantityPicker.RootProps["min"];
  /** 선택할 수 있는 최대 수량입니다. */
  max: SeedQuantityPicker.RootProps["max"];
  /**
   * 한 번의 조작으로 변경할 수량입니다.
   * @default 1
   */
  step?: SeedQuantityPicker.RootProps["step"];

  /**
   * 모든 조작을 비활성화합니다.
   * @default false
   */
  disabled?: SeedQuantityPicker.RootProps["disabled"];
  /**
   * 수량이 유효하지 않은 상태임을 나타냅니다.
   * @default false
   */
  invalid?: SeedQuantityPicker.RootProps["invalid"];
  /**
   * 값을 표시하되 변경할 수 없도록 합니다.
   * @default false
   */
  readOnly?: SeedQuantityPicker.RootProps["readOnly"];
  /** 전체 또는 특정 action을 loading 상태로 전환하고 해당 조작을 막습니다. */
  loading?: SeedQuantityPicker.RootProps["loading"];

  /**
   * 값이 `min`일 때 Decrement 버튼을 Remove 버튼으로 전환합니다.
   * @default false
   */
  removable?: SeedQuantityPicker.RootProps["removable"];
  /** Remove 버튼을 누를 때 호출됩니다. */
  onRemove?: SeedQuantityPicker.RootProps["onRemove"];
  /**
   * Remove 버튼의 접근성 이름입니다.
   * @default "상품 삭제"
   */
  removeAriaLabel?: SeedQuantityPicker.RootProps["removeAriaLabel"];
  /** 표시할 수량 텍스트를 반환합니다. 단위나 보조 설명을 덧붙일 때 사용합니다. */
  getValueText?: SeedQuantityPicker.RootProps["getValueText"];

  /**
   * 컴포넌트의 크기입니다.
   * @default "medium"
   */
  size?: SeedQuantityPicker.RootProps["size"];
  /**
   * 컴포넌트가 부모 Flex 레이아웃의 여유 공간을 채울지 지정합니다.
   * @since 2.2.0
   * @default "hug"
   */
  layout?: SeedQuantityPicker.RootProps["layout"];
  /**
   * 버튼과 값의 배치 방향입니다.
   * @default "ltr"
   */
  dir?: SeedQuantityPicker.RootProps["dir"];

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

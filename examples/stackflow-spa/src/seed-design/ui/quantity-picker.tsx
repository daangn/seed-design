import {
  IconMinusLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
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

  decrementAriaLabel?: string;
  incrementAriaLabel?: string;

  decrementIcon?: React.ReactNode;
  incrementIcon?: React.ReactNode;
  removeIcon?: React.ReactNode;
  loadingIndicator?: React.ReactNode;

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

import IconMinusLine from "@karrotmarket/lynx-monochrome-icon/IconMinusLine";
import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import IconTrashcanLine from "@karrotmarket/lynx-monochrome-icon/IconTrashcanLine";
import * as React from "@lynx-js/react";
import {
  ProgressCircle as SeedProgressCircle,
  QuantityPicker as SeedQuantityPicker,
} from "@seed-design/lynx-react";

function resolveProgressCircleProps(
  size: SeedQuantityPicker.RootProps["size"],
): Pick<SeedProgressCircle.RootProps, "size" | "style"> {
  switch (size) {
    case "small":
      return { size: "16" };
    case "large":
      return { size: "24", style: { transform: "scale(0.9166667)" } };
    default:
      return { size: "18" };
  }
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type QuantityPickerProps = DistributiveOmit<
  SeedQuantityPicker.RootProps,
  "children" | "removeAccessibilityLabel"
> & {
  /**
   * Remove 버튼의 접근성 이름입니다.
   * @default "상품 삭제"
   */
  removeAccessibilityLabel?: SeedQuantityPicker.RootProps["removeAccessibilityLabel"];

  /**
   * Decrement 버튼의 접근성 이름입니다.
   * @default "수량 줄이기"
   */
  decrementAccessibilityLabel?: string;
  /**
   * Increment 버튼의 접근성 이름입니다.
   * @default "수량 늘리기"
   */
  incrementAccessibilityLabel?: string;

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
   * @default <ProgressCircle.Root><ProgressCircle.Range /></ProgressCircle.Root>
   */
  loadingIndicator?: React.ReactNode;
};

/**
 * @see https://seed-design.io/lynx/components/quantity-picker
 */
export const QuantityPicker = React.forwardRef<unknown, QuantityPickerProps>(
  (
    {
      decrementAccessibilityLabel = "수량 줄이기",
      incrementAccessibilityLabel = "수량 늘리기",
      removeAccessibilityLabel = "상품 삭제",
      decrementIcon = <IconMinusLine />,
      incrementIcon = <IconPlusLine />,
      removeIcon = <IconTrashcanLine />,
      loadingIndicator,
      size,
      ...rootProps
    },
    ref,
  ) => {
    const resolvedLoadingIndicator =
      loadingIndicator === undefined ? (
        <SeedProgressCircle.Root {...resolveProgressCircleProps(size)} tone="inherit">
          <SeedProgressCircle.Range />
        </SeedProgressCircle.Root>
      ) : (
        loadingIndicator
      );

    const resolvedRootProps: SeedQuantityPicker.RootProps = rootProps.removable
      ? {
          ...rootProps,
          removable: true,
          removeAccessibilityLabel,
        }
      : {
          ...rootProps,
          removable: false,
          removeAccessibilityLabel,
        };

    return (
      <SeedQuantityPicker.Root ref={ref} size={size} {...resolvedRootProps}>
        <SeedQuantityPicker.DecrementButton
          accessibility-label={decrementAccessibilityLabel}
          icon={decrementIcon}
          loadingIndicator={resolvedLoadingIndicator}
          removeIcon={removeIcon}
        />
        <SeedQuantityPicker.ValueDisplay />
        <SeedQuantityPicker.IncrementButton
          accessibility-label={incrementAccessibilityLabel}
          icon={incrementIcon}
          loadingIndicator={resolvedLoadingIndicator}
        />
      </SeedQuantityPicker.Root>
    );
  },
);
QuantityPicker.displayName = "QuantityPicker";

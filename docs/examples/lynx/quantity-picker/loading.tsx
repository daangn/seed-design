import "./styles";

import { useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";
import { QuantityPicker } from "@/components/ui/quantity-picker";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [decrementLoading, setDecrementLoading] = useState(false);
  const [incrementLoading, setIncrementLoading] = useState(false);
  const allLoading = decrementLoading && incrementLoading;

  function toggleAllLoading() {
    "background only";
    const nextLoading = !allLoading;
    setDecrementLoading(nextLoading);
    setIncrementLoading(nextLoading);
  }

  function toggleDecrementLoading() {
    "background only";
    setDecrementLoading((current) => !current);
  }

  function toggleIncrementLoading() {
    "background only";
    setIncrementLoading((current) => !current);
  }

  return (
    <view className={`${seedClassName} docs-lynx-quantity-picker-root`}>
      <view className="quantity-picker-preview">
        <view className="quantity-picker-example">
          <text className="quantity-picker-example-title">Loading</text>
          <QuantityPicker
            min={1}
            max={99}
            defaultValue={2}
            loading={
              allLoading
                ? true
                : {
                    decrement: decrementLoading,
                    increment: incrementLoading,
                  }
            }
            accessibility-label="상품 수량"
          />
          <view className="quantity-picker-example-controls">
            <ActionButton
              className="quantity-picker-example-control"
              variant="neutralWeak"
              bindtap={toggleAllLoading}
            >
              전체 {allLoading ? "끄기" : "켜기"}
            </ActionButton>
            <ActionButton
              className="quantity-picker-example-control"
              variant="neutralWeak"
              bindtap={toggleDecrementLoading}
            >
              감소 {decrementLoading ? "끄기" : "켜기"}
            </ActionButton>
            <ActionButton
              className="quantity-picker-example-control"
              variant="neutralWeak"
              bindtap={toggleIncrementLoading}
            >
              증가 {incrementLoading ? "끄기" : "켜기"}
            </ActionButton>
          </view>
          <text className="quantity-picker-example-status">
            감소: {decrementLoading ? "loading" : "준비"} · 증가:{" "}
            {incrementLoading ? "loading" : "준비"}
          </text>
        </view>
      </view>
    </view>
  );
}

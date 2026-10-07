import "./styles";

import { useState } from "@lynx-js/react";

import { QuantityPicker } from "@/components/ui/quantity-picker";

export default function Example() {
  const [quantity, setQuantity] = useState(2);

  function handleValueChange(nextQuantity: number) {
    "background only";
    setQuantity(nextQuantity);
  }

  return (
    <view className="quantity-picker-example">
      <text className="quantity-picker-example-title">Controlled</text>
      <QuantityPicker
        min={1}
        max={99}
        value={quantity}
        onValueChange={handleValueChange}
        accessibility-label="상품 수량"
      />
      <text className="quantity-picker-example-status">현재 수량: {quantity}개</text>
    </view>
  );
}

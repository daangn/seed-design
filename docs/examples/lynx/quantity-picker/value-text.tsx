import "./styles";

import { QuantityPicker } from "@/components/ui/quantity-picker";

export default function Example() {
  return (
    <view className="quantity-picker-example">
      <text className="quantity-picker-example-title">Value text</text>
      <view className="quantity-picker-example-controls">
        <QuantityPicker
          min={1}
          max={99}
          defaultValue={1}
          accessibility-label="상품 수량"
          getValueText={(valueText: string) => `${valueText}개`}
        />
      </view>
    </view>
  );
}

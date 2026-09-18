import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { QuantityPicker } from "@/components/ui/quantity-picker";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-quantity-picker-root`}>
      <view className="quantity-picker-preview">
        <view className="quantity-picker-example quantity-picker-layout-host">
          <text className="quantity-picker-example-title">Layout</text>
          <view className="quantity-picker-layout-row">
            <text className="quantity-picker-layout-label">Hug (기본)</text>
            <view className="quantity-picker-example-controls">
              <QuantityPicker
                layout="hug"
                min={1}
                max={99}
                defaultValue={1}
                accessibility-label="Hug 상품 수량"
              />
            </view>
          </view>
          <view className="quantity-picker-layout-row">
            <text className="quantity-picker-layout-label">Fill</text>
            <view className="quantity-picker-example-controls">
              <QuantityPicker
                layout="fill"
                min={1}
                max={99}
                defaultValue={1}
                accessibility-label="Fill 상품 수량"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  );
}

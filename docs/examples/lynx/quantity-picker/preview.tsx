import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { QuantityPicker } from "@/components/ui/quantity-picker";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-quantity-picker-root`}>
      <view className="quantity-picker-preview">
        <QuantityPicker min={1} max={99} defaultValue={1} accessibility-label="상품 수량" />
      </view>
    </view>
  );
}

import "./styles";

import { useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName, VStack } from "@seed-design/lynx-react";
import { QuantityPicker } from "@/components/ui/quantity-picker";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [removed, setRemoved] = useState(false);

  function handleRemove() {
    "background only";
    setRemoved(true);
  }

  function handleRestore() {
    "background only";
    setRemoved(false);
  }

  return (
    <view className={`${seedClassName} quantity-picker-example`}>
      <text className="quantity-picker-example-title">Removable</text>
      {removed ? (
        <VStack gap="x4">
          <text className="quantity-picker-example-status">상품을 삭제했습니다.</text>
          <view className="quantity-picker-example-controls">
            <ActionButton
              className="quantity-picker-example-control"
              variant="neutralWeak"
              bindtap={handleRestore}
            >
              되돌리기
            </ActionButton>
          </view>
        </VStack>
      ) : (
        <>
          <view className="quantity-picker-example-controls">
            <QuantityPicker
              min={1}
              max={99}
              defaultValue={1}
              removable
              removeAccessibilityLabel="상품 삭제"
              accessibility-label="상품 수량"
              onRemove={handleRemove}
            />
          </view>
          <text className="quantity-picker-example-status">
            최솟값에서 감소 버튼을 누르면 수량 선택기가 제거됩니다.
          </text>
        </>
      )}
    </view>
  );
}

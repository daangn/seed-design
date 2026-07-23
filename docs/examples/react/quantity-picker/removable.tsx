import { Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerRemovable() {
  const [removed, setRemoved] = useState(false);

  if (removed) {
    return <Text textStyle="t4Regular">상품을 삭제했습니다.</Text>;
  }

  return (
    <VStack gap="x3" align="center">
      <QuantityPicker
        min={1}
        max={99}
        defaultValue={1}
        removable
        aria-label="상품 수량"
        removeAriaLabel="상품 삭제"
        onRemove={() => setRemoved(true)}
        getValueText={(value) => `${value}개`}
      />
      <Text textStyle="t4Regular">최소 수량에서 Decrement 버튼이 Remove 버튼으로 전환됩니다.</Text>
    </VStack>
  );
}

import { Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerControlled() {
  const [quantity, setQuantity] = useState(2);

  return (
    <VStack gap="x3" align="center">
      <QuantityPicker
        min={1}
        max={99}
        value={quantity}
        onValueChange={setQuantity}
        aria-label="상품 수량"
      />
      <Text textStyle="t4Regular">현재 수량: {quantity}개</Text>
    </VStack>
  );
}

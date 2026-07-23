import { VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerLoading() {
  const [loading, setLoading] = useState(false);

  function toggleLoading() {
    setLoading((current) => !current);
  }

  return (
    <VStack gap="x3" align="flex-start">
      <QuantityPicker
        min={1}
        max={99}
        defaultValue={2}
        loading={{ increment: loading }}
        aria-label="상품 수량"
        getValueText={(value) => `${value}개`}
      />
      <ActionButton variant="neutralWeak" onClick={toggleLoading}>
        Increment loading 전환
      </ActionButton>
    </VStack>
  );
}

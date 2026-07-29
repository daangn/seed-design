import { HStack, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerLoading() {
  const [decrementLoading, setDecrementLoading] = useState(false);
  const [incrementLoading, setIncrementLoading] = useState(false);
  const allLoading = decrementLoading && incrementLoading;

  function toggleAllLoading() {
    const nextLoading = !allLoading;
    setDecrementLoading(nextLoading);
    setIncrementLoading(nextLoading);
  }

  return (
    <VStack gap="x3" align="flex-start">
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
        aria-label="상품 수량"
      />
      <HStack gap="x2">
        <ActionButton variant="neutralWeak" aria-pressed={allLoading} onClick={toggleAllLoading}>
          전체
        </ActionButton>
        <ActionButton
          variant="neutralWeak"
          aria-pressed={decrementLoading}
          onClick={() => setDecrementLoading((current) => !current)}
        >
          Decrement
        </ActionButton>
        <ActionButton
          variant="neutralWeak"
          aria-pressed={incrementLoading}
          onClick={() => setIncrementLoading((current) => !current)}
        >
          Increment
        </ActionButton>
      </HStack>
    </VStack>
  );
}

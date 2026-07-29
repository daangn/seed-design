import { HStack, Text, VStack } from "@seed-design/react";
import { useState, type FormEvent } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerForm() {
  const [submittedQuantity, setSubmittedQuantity] = useState<number | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setSubmittedQuantity(Number(formData.get("quantity")));
  }

  return (
    <VStack asChild gap="x3" align="flex-start">
      <form onSubmit={handleSubmit}>
        <QuantityPicker
          min={1}
          max={99}
          defaultValue={1}
          aria-label="상품 수량"
          inputProps={{ name: "quantity" }}
        />
        <HStack gap="x2">
          <ActionButton type="submit" variant="neutralSolid">
            제출
          </ActionButton>
          {submittedQuantity !== null && (
            <Text textStyle="t4Regular">제출한 수량: {submittedQuantity}개</Text>
          )}
        </HStack>
      </form>
    </VStack>
  );
}

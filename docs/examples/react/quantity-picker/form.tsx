import { VStack } from "@seed-design/react";
import type { FormEvent } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    window.alert(`제출한 수량: ${formData.get("quantity")}개`);
  }

  return (
    <VStack asChild gap="x3" align="flex-start" justify="center">
      <form onSubmit={handleSubmit}>
        <QuantityPicker
          min={1}
          max={99}
          defaultValue={1}
          aria-label="상품 수량"
          inputProps={{ name: "quantity" }}
        />
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
      </form>
    </VStack>
  );
}

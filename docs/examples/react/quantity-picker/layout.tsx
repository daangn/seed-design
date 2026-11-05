import { HStack, Text, VStack } from "@seed-design/react";
import { QuantityPicker } from "seed-design/ui/quantity-picker";

export default function QuantityPickerLayout() {
  return (
    <VStack width="360px" gap="x4" align="stretch">
      <VStack gap="x2" align="stretch">
        <Text>Hug (기본)</Text>
        <HStack width="full">
          <QuantityPicker
            layout="hug"
            min={1}
            max={99}
            defaultValue={1}
            aria-label="Hug 상품 수량"
          />
        </HStack>
      </VStack>

      <VStack gap="x2" align="stretch">
        <Text>Fill</Text>
        <HStack width="full">
          <QuantityPicker
            layout="fill"
            min={1}
            max={99}
            defaultValue={1}
            aria-label="Fill 상품 수량"
          />
        </HStack>
      </VStack>
    </VStack>
  );
}

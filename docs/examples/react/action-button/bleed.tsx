import { HStack, Text, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

export default function ActionButtonBleed() {
  return (
    <VStack width="100%" gap="x4">
      <HStack align="center" justify="space-between" borderWidth={1} borderColor="palette.red600">
        <Text fontSize="t6">Bleed Example</Text>
        <ActionButton bleedY="asPadding" variant="brandSolid">
          Bleed Y
        </ActionButton>
      </HStack>
      <HStack align="center" justify="space-between" borderWidth={1} borderColor="palette.red600">
        <Text fontSize="t6">Bleed Example</Text>
        <ActionButton bleedX="asPadding" bleedY="asPadding" variant="ghost">
          Bleed X and Y
        </ActionButton>
      </HStack>
    </VStack>
  );
}

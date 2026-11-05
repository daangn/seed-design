import { ActionButton, HStack, Text, VStack } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <VStack width="100%" gap="x4">
      <HStack
        align="center"
        justify="space-between"
        py="x2"
        borderWidth={1}
        borderColor="palette.red600"
      >
        <Text textStyle="t6Regular">세로 Bleed</Text>
        <ActionButton bleedY="8px" variant="brandSolid">
          Bleed Y
        </ActionButton>
      </HStack>
      <HStack
        align="center"
        justify="space-between"
        p="x2"
        borderWidth={1}
        borderColor="palette.red600"
      >
        <Text textStyle="t6Regular">전체 Bleed</Text>
        <ActionButton bleed="8px" variant="ghost">
          모든 방향
        </ActionButton>
      </HStack>
    </VStack>
  );
}

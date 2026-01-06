import { HStack, VStack, Text } from "@seed-design/react";

export default function TailwindBorderRadius() {
  return (
    <HStack gap="x4" align="center">
      <VStack gap="x3" align="center">
        <div className="size-x10 bg-bg-neutral-solid rounded-r2" />
        <Text textStyle="t4Regular">rounded-r2</Text>
      </VStack>
      <VStack gap="x3" align="center">
        <div className="size-x10 bg-bg-neutral-solid rounded-r4" />
        <Text textStyle="t4Regular">rounded-r4</Text>
      </VStack>
      <VStack gap="x3" align="center">
        <div className="size-x10 bg-bg-neutral-solid rounded-full" />
        <Text textStyle="t4Regular">rounded-full</Text>
      </VStack>
    </HStack>
  );
}

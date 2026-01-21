import { VStack, Text } from "@seed-design/react";

export default function TailwindGradient() {
  return (
    <VStack gap="x4">
      <VStack gap="x2">
        <div className="h-x10 bg-gradient-glow-magic-[90deg] rounded-r2" />
        <Text>bg-gradient-glow-magic-[90deg]</Text>
      </VStack>
      <VStack gap="x2">
        <div className="h-x10 bg-gradient-highlight-magic-[90deg] rounded-r2" />
        <Text>bg-gradient-highlight-magic-[90deg]</Text>
      </VStack>
    </VStack>
  );
}

import { Badge, HStack, VStack } from "@seed-design/react";

export default function BadgePositive() {
  return (
    <HStack gap="x4">
      <VStack gap="x4">
        <Badge tone="positive" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="positive" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="positive" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="positive" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="positive" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="positive" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}

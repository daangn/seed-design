import { Badge, HStack, VStack } from "@seed-design/react";

export default function BadgeNeutral() {
  return (
    <HStack gap="x4">
      <VStack gap="x4">
        <Badge tone="neutral" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="neutral" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="neutral" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="neutral" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="neutral" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="neutral" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}

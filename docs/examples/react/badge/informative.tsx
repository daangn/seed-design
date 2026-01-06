import { Badge, HStack, VStack } from "@seed-design/react";

export default function BadgeInformative() {
  return (
    <HStack gap="x4">
      <VStack gap="x4">
        <Badge tone="informative" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="informative" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="informative" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="informative" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="informative" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="informative" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}

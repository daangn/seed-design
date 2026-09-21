"use client";

import { HStack, VStack } from "@seed-design/react";
import { Badge } from "seed-design/ui/badge";

export default function BadgeWarning() {
  return (
    <HStack gap="x4">
      <VStack gap="x4">
        <Badge tone="warning" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="warning" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="warning" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="warning" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="warning" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="warning" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}

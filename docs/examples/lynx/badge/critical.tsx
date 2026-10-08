import { HStack, VStack } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";

export default function Example() {
  return (
    <HStack width="full" gap="x4">
      <VStack gap="x4">
        <Badge tone="critical" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="critical" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="critical" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="critical" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="critical" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="critical" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}

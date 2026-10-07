import { HStack, VStack } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";

export default function Example() {
  return (
    <HStack width="full" gap="x4">
      <VStack gap="x4">
        <Badge tone="brand" variant="solid" size="medium">
          라벨
        </Badge>
        <Badge tone="brand" variant="weak" size="medium">
          라벨
        </Badge>
        <Badge tone="brand" variant="outline" size="medium">
          라벨
        </Badge>
      </VStack>
      <VStack gap="x4">
        <Badge tone="brand" variant="solid" size="large">
          라벨
        </Badge>
        <Badge tone="brand" variant="weak" size="large">
          라벨
        </Badge>
        <Badge tone="brand" variant="outline" size="large">
          라벨
        </Badge>
      </VStack>
    </HStack>
  );
}

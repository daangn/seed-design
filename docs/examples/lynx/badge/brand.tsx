import "./styles";

import { Badge, HStack, useSeedClassName, VStack } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-badge-root`}>
      <view className="badge-preview">
        <HStack gap="x4">
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
      </view>
    </view>
  );
}

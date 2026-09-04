import "./styles";

import { root } from "@lynx-js/react";
import { Badge, HStack, useSeedClassName, VStack } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="badge-preview">
        <HStack gap="x4">
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
      </view>
    </page>
  );
}

root.render(<Root />);

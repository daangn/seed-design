import { root } from "@lynx-js/react";
import { Badge, HStack, useSeedClassName, VStack } from "@seed-design/lynx-react";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="badge-preview">
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
      </view>
    </page>
  );
}

root.render(<Root />);

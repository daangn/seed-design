import { root } from "@lynx-js/react";
import { HStack, useSeedClassName, VStack } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="badge-preview">
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
      </view>
    </page>
  );
}

root.render(<Root />);

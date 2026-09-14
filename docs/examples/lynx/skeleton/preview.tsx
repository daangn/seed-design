import "./styles";

import { Skeleton, useSeedClassName, VStack } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-skeleton-root`}>
      <view className="skeleton-preview">
        <VStack gap="x4" align="center">
          <Skeleton radius="full" width="48px" height="48px" />
          <VStack gap="x2">
            <Skeleton radius="8" width="250px" height="16px" />
            <Skeleton radius="8" width="250px" height="16px" />
          </VStack>
        </VStack>
      </view>
    </view>
  );
}

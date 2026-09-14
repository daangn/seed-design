import "./styles";

import { Skeleton, useSeedClassName, VStack } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-skeleton-root`}>
      <view className="skeleton-preview">
        <VStack gap="x4" align="flex-start" width="full">
          <Skeleton tone="neutral" radius="16" width="full" height="48px" />
          <Skeleton tone="magic" radius="16" width="full" height="48px" />
        </VStack>
      </view>
    </view>
  );
}

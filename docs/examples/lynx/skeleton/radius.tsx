import "./styles";

import { HStack, Skeleton, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-skeleton-root`}>
      <view className="skeleton-preview">
        <HStack gap="x4" align="center">
          <Skeleton radius="0" width="48px" height="48px" />
          <Skeleton radius="8" width="48px" height="48px" />
          <Skeleton radius="16" width="48px" height="48px" />
          <Skeleton radius="full" width="48px" height="48px" />
        </HStack>
      </view>
    </view>
  );
}

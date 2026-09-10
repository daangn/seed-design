import "./styles";

import { Badge, useSeedClassName, VStack } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-badge-root`}>
      <view className="badge-preview">
        <VStack gap="x4">
          <Badge size="medium">
            In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
          </Badge>
          <Badge size="large">
            In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
          </Badge>
        </VStack>
      </view>
    </view>
  );
}

import "./styles";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-badge-root`}>
      <view className="badge-preview">
        <VStack gap="x4">
          <Badge style={{ maxWidth: "120px" }}>
            In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
          </Badge>
          <Badge style={{ maxWidth: "200px" }}>
            In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
          </Badge>
        </VStack>
      </view>
    </view>
  );
}

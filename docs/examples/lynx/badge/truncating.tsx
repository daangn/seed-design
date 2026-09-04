import "./styles";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-badge-root`}>
      <view className="badge-preview">
        <Badge style={{ maxWidth: "120px" }}>
          In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
        </Badge>
      </view>
    </view>
  );
}

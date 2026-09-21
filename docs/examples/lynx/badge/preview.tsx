import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-badge-root`}>
      <view className="badge-preview">
        <Badge>라벨</Badge>
      </view>
    </view>
  );
}

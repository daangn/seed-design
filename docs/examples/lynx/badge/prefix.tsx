import "./styles";

import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-badge-root`}>
      <view className="badge-preview">
        <Badge prefix={<IconPlusFill />}>추가</Badge>
      </view>
    </view>
  );
}

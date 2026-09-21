import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-badge-root`}>
      <view className="badge-preview">
        <Badge
          actionProps={{
            "accessibility-label": "도움말",
            bindtap: () => console.log("도움말 열기"),
          }}
        >
          판매 완료
        </Badge>
      </view>
    </view>
  );
}

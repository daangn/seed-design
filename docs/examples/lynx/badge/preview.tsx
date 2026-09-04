import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="badge-preview">
        <Badge>라벨</Badge>
      </view>
    </page>
  );
}

root.render(<Root />);

import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-switch-root`}>
      <view className="switch-preview">
        <Switch accessibility-label="Switch" defaultChecked />
      </view>
    </view>
  );
}

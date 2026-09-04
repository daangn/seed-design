import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="switch-preview">
        <Switch tone="neutral" label="Neutral" defaultChecked />
      </view>
    </page>
  );
}

root.render(<Root />);

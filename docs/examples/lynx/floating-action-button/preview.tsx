import "./styles";

import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";

import { useSeedClassName } from "@seed-design/lynx-react";
import { FloatingActionButton } from "@/components/ui/floating-action-button";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-floating-action-button-root`}>
      <view className="floating-action-button-preview">
        <FloatingActionButton icon={<IconPlusLine />} label="Example FAB" />
      </view>
    </view>
  );
}

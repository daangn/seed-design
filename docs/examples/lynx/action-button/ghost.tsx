import "./styles";
import IconTagFill from "@karrotmarket/lynx-monochrome-icon/IconTagFill";

import { ActionButton, PrefixIcon, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-action-button-root`}>
      <view className="action-button-preview">
        <ActionButton variant="ghost">
          <PrefixIcon icon={<IconTagFill />} />
          Default (fg.neutral)
        </ActionButton>
      </view>
    </view>
  );
}

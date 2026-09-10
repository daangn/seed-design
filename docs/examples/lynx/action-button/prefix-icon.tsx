import "./styles";
import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";

import { ActionButton, PrefixIcon, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-action-button-root`}>
      <view className="action-button-preview">
        <ActionButton>
          <PrefixIcon icon={<IconPlusFill />} />
          라벨
        </ActionButton>
      </view>
    </view>
  );
}

import "./styles";
import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";

import { ActionButton, Icon, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-action-button-root`}>
      <view className="action-button-preview">
        <ActionButton layout="iconOnly" accessibility-label="추가">
          <Icon icon={<IconPlusFill />} />
        </ActionButton>
      </view>
    </view>
  );
}

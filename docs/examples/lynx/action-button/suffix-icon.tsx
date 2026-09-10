import "./styles";
import IconChevronRightFill from "@karrotmarket/lynx-monochrome-icon/IconChevronRightFill";

import { ActionButton, SuffixIcon, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-action-button-root`}>
      <view className="action-button-preview">
        <ActionButton>
          라벨
          <SuffixIcon icon={<IconChevronRightFill />} />
        </ActionButton>
      </view>
    </view>
  );
}

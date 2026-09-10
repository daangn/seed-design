import "./styles";

import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={`${seedClassName} docs-lynx-action-button-root`}>
      <view className="action-button-preview">
        <ActionButton variant="criticalSolid">라벨</ActionButton>
      </view>
    </view>
  );
}

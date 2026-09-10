import "./styles";

import { Divider, useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-divider-root`}>
      <view className="divider-example divider-example--column">
        <view className="divider-example__vertical-stack">
          <view className="divider-example__block" />
          <Divider />
          <view className="divider-example__block" />
        </view>
        <view className="divider-example__horizontal-stack">
          <view className="divider-example__block" />
          <Divider orientation="vertical" />
          <view className="divider-example__block" />
        </view>
      </view>
    </view>
  );
}
